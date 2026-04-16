-- MOCK DATA SEED SCRIPT
-- Run this in your Supabase SQL Editor to populate your dashboards with initial test data.

-- 1. Insert Default Session Types (Matches site services)
INSERT INTO public.session_types (title, description, pricing, duration_minutes, location)
VALUES 
('Initial Consultation', 'Full clinical evaluation and first adjustment.', 150.00, 45, 'Moorestown Clinic'),
('Standard Adjustment', 'Routine spinal alignment and mobility check.', 60.00, 20, 'Moorestown Clinic'),
('Mobility & Movement', 'Focused session on functional movement and stretching.', 85.00, 40, 'Movement Lab'),
('Posture & Desk Relief', 'Corrective care for office-related strain.', 75.00, 30, 'Moorestown Clinic')
ON CONFLICT DO NOTHING;

-- 2. Insert some available sessions (instances) for the next 7 days
-- Note: Replace the UUIDs below if needed, but since we are seeding we can just use defaults.
-- We'll use a subquery to get the session type IDs.

DO $$
DECLARE
    initial_id UUID;
    standard_id UUID;
BEGIN
    SELECT id INTO initial_id FROM public.session_types WHERE title = 'Initial Consultation' LIMIT 1;
    SELECT id INTO standard_id FROM public.session_types WHERE title = 'Standard Adjustment' LIMIT 1;

    -- Create sessions for today and tomorrow
    INSERT INTO public.sessions (session_type_id, datetime, max_slots, booked_slots, status)
    VALUES 
    (initial_id, NOW() + INTERVAL '2 hours', 1, 0, 'active'),
    (standard_id, NOW() + INTERVAL '4 hours', 1, 0, 'active'),
    (standard_id, NOW() + INTERVAL '1 day 2 hours', 1, 0, 'active'),
    (initial_id, NOW() + INTERVAL '1 day 5 hours', 1, 0, 'active');
END $$;
