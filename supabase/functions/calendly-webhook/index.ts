import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY") ?? "";

Deno.serve(async (req: Request) => {
  // 1. Basic security / health check
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  try {
    const payload = await req.json();
    console.log("Received Calendly Webhook Payload:", JSON.stringify(payload, null, 2));
    
    const event = payload.event;
    
    // Only process invitee.created events
    if (event !== "invitee.created") {
      console.log(`Ignoring event type: ${event}`);
      return new Response(JSON.stringify({ message: "Event ignored" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const { payload: data } = payload;
    const inviteeEmail = data.email;
    const inviteeName = data.name;
    const startTime = data.scheduled_event.start_time;
    // Use the event name directly as event_type is just a URI
    const eventTypeName = data.scheduled_event.name || "Appointment";

    console.log(`Processing booking for: ${inviteeEmail} (${eventTypeName}) at ${startTime}`);

    // Create Supabase client with SERVICE ROLE key to bypass RLS
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // 2. Find the profile by email
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .ilike("email", inviteeEmail)
      .single();

    if (profileError || !profile) {
      console.error(`Profile not found for email: ${inviteeEmail}`);
      return new Response(JSON.stringify({ error: "User profile not found. Please sign up first." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. Map Event Name to Session Type dynamically
    // We search for a session type that matches the Calendly event name
    const { data: sessionType, error: typeError } = await supabase
      .from("session_types")
      .select("id")
      .ilike("title", `%${eventTypeName}%`)
      .limit(1)
      .maybeSingle();

    let sessionTypeId = sessionType?.id;

    // Fallback logic if naming doesn't match perfectly
    if (!sessionTypeId) {
       console.log("No direct title match, using fallback mapping...");
       const fallbackTitle = eventTypeName.toLowerCase().includes("initial") ? "Initial Consultation" : "Standard Adjustment";
       const { data: fallbackType } = await supabase
         .from("session_types")
         .select("id")
         .eq("title", fallbackTitle)
         .single();
       sessionTypeId = fallbackType?.id;
    }

    if (!sessionTypeId) {
      throw new Error(`Could not determine session type for: ${eventTypeName}`);
    }

    // 4. Find or Create Session
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("id")
      .eq("datetime", startTime)
      .eq("session_type_id", sessionTypeId)
      .maybeSingle();

    let finalSessionId = session?.id;

    if (sessionError) {
      throw new Error(`Error searching for session: ${sessionError.message}`);
    }

    if (!finalSessionId) {
      console.log(`Creating new session record for ${startTime}`);
      const { data: newSession, error: createSessionError } = await supabase
        .from("sessions")
        .insert({
          datetime: startTime,
          session_type_id: sessionTypeId,
          status: "active",
          max_slots: 1,
          booked_slots: 1
        })
        .select()
        .single();

      if (createSessionError) {
        throw new Error(`Error creating session: ${createSessionError.message}`);
      }
      finalSessionId = newSession.id;
    } else {
      // Update booked_slots if session existed
      await supabase
        .from("sessions")
        .update({ booked_slots: 1 })
        .eq("id", finalSessionId);
    }

    // 5. Insert Booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: profile.id,
        session_id: finalSessionId,
        status: "confirmed"
      })
      .select()
      .single();

    if (bookingError) {
      // Check if it's a conflict (already exists)
      if (bookingError.code === "23505") {
        console.log("Booking already exists, skipping.");
      } else {
        throw new Error(`Error creating booking: ${bookingError.message}`);
      }
    }

    console.log("Sync complete!");

    return new Response(JSON.stringify({ success: true, booking_id: booking?.id }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Webhook processing error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
