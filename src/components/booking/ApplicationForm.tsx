import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { InlineWidget } from "react-calendly";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site-config";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(6, { message: "Please enter a valid phone number." }),
  serviceId: z.string().min(1, { message: "Please select a service." }),
  concern: z.string().optional(),
});

interface ApplicationFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  service?: {
    id: string;
    name: string;
    price: string;
    calendlyUrl?: string;
  } | null;
}

export default function ApplicationForm({ isOpen, onOpenChange, service }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [formData, setFormData] = useState<z.infer<typeof formSchema> | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      serviceId: service?.id || "",
      concern: "",
    },
  });

  // Sync form with service prop when it changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (!showCalendar) {
        form.setValue("serviceId", service?.id || "");
      }
    } else {
      // Reset everything when modal closes
      setShowCalendar(false);
      setFormData(null);
      form.reset();
    }
  }, [service, isOpen, form, showCalendar]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // 1. Capture lead data (could send to database/webhook here)
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const selectedService = siteConfig.services.find(s => s.id === values.serviceId);
      
      if (!selectedService?.calendlyUrl) {
        throw new Error("Booking link not found");
      }

      // 2. Transition to Calendar view
      setFormData(values);
      setShowCalendar(true);
    } catch (error: any) {
      console.error("Booking Error:", error);
      toast.error("There was an issue initializing the calendar. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedServiceObj = siteConfig.services.find(
    s => s.id === (formData?.serviceId || form.getValues("serviceId"))
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`${
          showCalendar ? "sm:max-w-[900px] h-[90vh]" : "sm:max-w-[425px]"
        } transition-all duration-500 overflow-hidden flex flex-col rounded-[32px] bg-card/95 backdrop-blur-xl border border-primary/20 shadow-2xl shadow-primary/10 p-0`}
      >
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          <DialogHeader className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl md:text-3xl font-black tracking-tight text-white">
                {showCalendar ? "Select Your Time" : "Confirm Your Details"}
              </DialogTitle>
              {showCalendar && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowCalendar(false)}
                  className="text-muted-foreground hover:text-primary"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Edit Info
                </Button>
              )}
            </div>
            <DialogDescription className="text-slate-400 font-medium">
              {showCalendar ? (
                <>Almost there! Choose a time for your <span className="text-primary font-bold">{selectedServiceObj?.name}</span>.</>
              ) : (
                <>Provide your contact information to view available times for <span className="text-primary font-bold">{service?.name || "your session"}</span>.</>
              )}
            </DialogDescription>
          </DialogHeader>

          {!showCalendar ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {!service && (
                  <FormField
                    control={form.control}
                    name="serviceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 px-1">Specialization</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/40">
                              <SelectValue placeholder="Choose a treatment" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#080c14] border-white/10">
                            {siteConfig.services.map((s) => (
                              <SelectItem key={s.id} value={s.id} className="text-white hover:bg-primary/20 focus:bg-primary/20">
                                {s.name} · {s.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 px-1">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/40" />
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
                        <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 px-1">Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" {...field} className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/40" />
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
                        <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 px-1">Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="856-000-0000" {...field} className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/40" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-sm uppercase tracking-widest font-black transition-all hover:scale-[1.02] active:scale-95 bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-xl shadow-primary/20"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    <>View Live Availability</>
                  )}
                </Button>
                
                <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-wider px-4">
                  Secured & encrypted scheduling system
                </p>
              </form>
            </Form>
          ) : (
            <div className="mt-4 h-full min-h-[500px] bg-white/5 rounded-2xl overflow-hidden border border-white/5">
              <InlineWidget
                url={selectedServiceObj?.calendlyUrl || siteConfig.calendly.url}
                prefill={{
                  email: formData?.email,
                  firstName: formData?.name.split(" ")[0],
                  lastName: formData?.name.split(" ").slice(1).join(" "),
                }}
                styles={{
                  height: "100%",
                  minHeight: "500px",
                }}
                pageSettings={{
                  backgroundColor: "ffffff",
                  hideEventTypeDetails: true,
                  hideLandingPageDetails: true,
                  primaryColor: "0066FF",
                  textColor: "080c14",
                }}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

