import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(6, { message: "Please enter a valid phone number." }),
  concern: z.string().optional(),
});

interface ApplicationFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  service: {
    id: string;
    name: string;
    price: string;
    calendlyUrl?: string;
  };
}

export default function ApplicationForm({ isOpen, onOpenChange, service }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      concern: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // Simulate a short delay for lead capture feel
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!service.calendlyUrl) {
        throw new Error("Booking link not found");
      }

      // Redirect directly to Calendly
      window.location.href = service.calendlyUrl;
    } catch (error: any) {
      console.error("Booking Error:", error);
      toast.error("There was an issue initiating your booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden rounded-2xl bg-card/95 backdrop-blur-md border border-primary/20 shadow-2xl shadow-primary/10">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold tracking-tight">Schedule Your Visit</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            You're booking: <span className="font-semibold text-foreground">{service.name}</span>. 
            Complete this form to continue to scheduling.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="856-000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="concern"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Concern (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Lower back pain, posture..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold transition-all hover:scale-[1.02] active:scale-95"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>Continue to Booking</>
              )}
            </Button>
            
            <p className="text-[11px] text-center text-muted-foreground italic px-4">
              You'll pick your actual appointment time on the next page via Calendly.
            </p>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
