export const siteConfig = {
  name: "Moorestown Chiro",
  fullName: "Moorestown Chiropractic and Wellness",
  description: "Advanced chiropractic care and wellness services in Moorestown, NJ.",
  nav: [
    { id: "hero", label: "Overview" },
    { id: "book", label: "Book Now" },
    { id: "trust", label: "Provider" },
    { id: "testimonials", label: "Results" },
    { id: "logistics", label: "What to Expect" },
  ],
  author: {
    name: "Dr. Grant Parnagian",
    title: "Lead Chiropractor",
    initials: "GP",
    bio: "Dedicated to restoring movement and supporting long-term wellness for the Moorestown community.",
    fullBio: "Dr. Grant Parnagian is committed to providing structured, evidence-informed chiropractic care. His approach focuses on identifying the root cause of discomfort and creating sustainable paths to recovery and performance.",
    image: "/placeholder-practitioner.jpg",
  },
  location: {
    city: "Moorestown",
    address: "128 Borton Landing Road, Moorestown NJ 08057",
  },
  contact: {
    phone: "856-234-6373",
    email: "email@moorestownchiro.com",
  },
  calendly: {
    url: "https://calendly.com/michael-halloranai",
  },
  theme: {
    primary: "#0066FF",
  },
  credentials: [
    "Doctor of Chiropractic",
    "Evidence-informed clinical approach",
    "Wellness & performance optimization focus",
  ],
  services: [
    {
      id: "initial",
      name: "Initial Consultation",
      focus: "Comprehensive assessment, exam, and first treatment",
      duration: "30 min",
      idealFor: "New patients · First visit",
      frequency: "Most patients start with 1–2 visits in the first month.",
      price: "Starting at $140",
      calendlyUrl: "https://calendly.com/michael-halloranai/30min",
    },
    {
      id: "standard",
      name: "Standard Adjustment",
      focus: "Targeted spinal and joint adjustments for ongoing care",
      duration: "20 min",
      idealFor: "Returning patients · Maintenance care",
      frequency: "Often scheduled weekly, then tapered as symptoms improve.",
      price: "Starting at $80",
      calendlyUrl: "https://calendly.com/michael-halloranai/standard-adjustment",
    },
    {
      id: "mobility",
      name: "Mobility & Movement Session",
      focus: "Guided mobility work for problem areas and performance",
      duration: "30 min",
      idealFor: "Athletes · Active professionals",
      frequency: "Typically every 2–4 weeks during training blocks.",
      price: "Starting at $95",
      calendlyUrl: "https://calendly.com/michael-halloranai/mobility-movement-session",
    },
    {
      id: "posture",
      name: "Posture & Desk Relief Visit",
      focus: "Posture-focused care with ergonomic guidance",
      duration: "30 min",
      idealFor: "Desk workers · Hybrid/remote roles",
      frequency: "Commonly every 3–6 weeks depending on workload.",
      price: "Starting at $95",
      calendlyUrl: "https://calendly.com/michael-halloranai/posture-desk-relief-visit",
    },
  ],
  approach: [
    { 
      title: "Assessment-first", 
      text: "Every plan starts with a detailed evaluation to understand your unique needs." 
    },
    { 
      title: "Evidence-based", 
      text: "Clear, structured treatment plans focused on long-term outcomes." 
    },
    { 
      title: "Wellness-focused", 
      text: "Supporting busy professionals and families with care that fits their lifestyle." 
    },
  ]
};
