import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  BookOpen, 
  Move, 
  Apple, 
  ChevronRight, 
  Search,
  ArrowLeft,
  Clock,
  ExternalLink,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Resource {
  id: string;
  title: string;
  category: "clinical" | "mobility" | "nutrition";
  description: string;
  content: string;
  readTime: string;
  icon: any;
}

const resources: Resource[] = [
  {
    id: "first-visit",
    title: "Your First Visit",
    category: "clinical",
    description: "What to expect during your initial consultation and adjustment.",
    readTime: "5 min",
    icon: BookOpen,
    content: `
      <h2>Welcome to Moorestown Chiro</h2>
      <p>Your first visit is the foundation of your journey to wellness. Here is exactly what will happen:</p>
      <ul>
        <li><strong>Initial Consultation:</strong> We'll discuss your health history and current concerns.</li>
        <li><strong>Physical Examination:</strong> A comprehensive assessment of your spine, posture, and mobility.</li>
        <li><strong>X-Rays (if needed):</strong> To get a deeper look at your alignment.</li>
        <li><strong>Initial Adjustment:</strong> In most cases, you'll receive your first gentle adjustment on day one.</li>
      </ul>
      <p>Please arrive 15 minutes early to complete your digital paperwork if you haven't already.</p>
    `
  },
  {
    id: "benefits",
    title: "Benefits of Chiropractic Care",
    category: "clinical",
    description: "Explore how adjustments impact your nervous system and overall health.",
    readTime: "8 min",
    icon: BookOpen,
    content: `
      <h2>Beyond Back Pain</h2>
      <p>While many patients come to us for pain relief, the benefits of chiropractic care extend far beyond that.</p>
      <h3>Key Benefits:</h3>
      <ul>
        <li><strong>Improved Nervous System Function:</strong> Your spine houses your nervous system; alignment ensures optimal communication between brain and body.</li>
        <li><strong>Enhanced Mobility:</strong> Restore natural range of motion in your joints.</li>
        <li><strong>Boosted Immune Response:</strong> A healthy spine supports a healthy immune system.</li>
        <li><strong>Stress Reduction:</strong> Physical alignment helps regulate the body's stress response.</li>
      </ul>
    `
  },
  {
    id: "mckenzie",
    title: "The McKenzie Method",
    category: "mobility",
    description: "A worldwide recognized system of assessment and management for spinal pain.",
    readTime: "10 min",
    icon: Move,
    content: `
      <h2>The McKenzie Method (MDT)</h2>
      <p>The McKenzie Method is a comprehensive approach to the spine that focuses on patient empowerment and self-treatment.</p>
      <h3>Mechanical Diagnosis and Therapy:</h3>
      <p>This method uses specific movements to "centralize" pain, moving it from your limbs back toward the spine, which is a sign of healing.</p>
      <ul>
        <li><strong>Self-Treatment:</strong> We teach you specific exercises to manage your own symptoms.</li>
        <li><strong>Prevention:</strong> Understanding your "directional preference" helps prevent future episodes.</li>
      </ul>
    `
  },
  {
    id: "pilates",
    title: "Pilates for Spinal Health",
    category: "mobility",
    description: "Core strengthening and alignment techniques to support your adjustments.",
    readTime: "12 min",
    icon: Move,
    content: `
      <h2>Core Stability & Alignment</h2>
      <p>Pilates is the perfect companion to chiropractic care because it focuses on the deep stabilizing muscles of the core.</p>
      <ul>
        <li><strong>Neutral Spine:</strong> Learn to maintain your alignment during movement.</li>
        <li><strong>Controlled Movement:</strong> Improve coordination and balance.</li>
        <li><strong>Decompression:</strong> Many Pilates exercises focus on lengthening the spine.</li>
      </ul>
    `
  },
  {
    id: "holistic-recovery",
    title: "Holistic Recovery",
    category: "nutrition",
    description: "Anti-inflammatory nutrition and lifestyle choices for faster healing.",
    readTime: "15 min",
    icon: Apple,
    content: `
      <h2>Fuelling Your Recovery</h2>
      <p>What you put in your body directly impacts how quickly you heal from an injury or adjustment.</p>
      <h3>Anti-Inflammatory Principles:</h3>
      <ul>
        <li><strong>Hydration:</strong> Disc health requires massive amounts of water. Aim for half your body weight in ounces daily.</li>
        <li><strong>Omega-3s:</strong> Found in fish oil and walnuts, these are natural inflammation fighters.</li>
        <li><strong>Magnesium:</strong> Essential for muscle relaxation and recovery.</li>
        <li><strong>Limit Processed Sugars:</strong> Sugar is a major driver of systemic inflammation and pain.</li>
      </ul>
    `
  }
];

const categoryInfo = {
  clinical: { title: "Clinical Guides", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
  mobility: { title: "Specialized Mobility Techniques", icon: Move, color: "text-purple-600", bg: "bg-purple-50" },
  nutrition: { title: "Nutritional Wellness", icon: Apple, color: "text-emerald-600", bg: "bg-emerald-50" },
};

const Resources = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Clear selected resource when category changes from sidebar
  useEffect(() => {
    setSelectedResource(null);
  }, [category]);

  const filteredResources = resources.filter(r => {
    const matchesCategory = !category || r.category === category;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (selectedResource) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-8 group text-slate-500 hover:text-primary transition-all"
            onClick={() => setSelectedResource(null)}
          >
            <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Resources
          </Button>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className={`p-8 md:p-12 ${categoryInfo[selectedResource.category].bg}`}>
              <Badge className="mb-4 bg-white/80 backdrop-blur-sm text-primary border-none text-[10px] font-bold tracking-widest uppercase">
                {categoryInfo[selectedResource.category].title}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">
                {selectedResource.title}
              </h1>
              <div className="flex items-center gap-6 text-slate-600 font-medium text-sm">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 opacity-70" />
                  {selectedResource.readTime} read
                </span>
                <span className="flex items-center gap-2">
                  <selectedResource.icon className="h-4 w-4 opacity-70" />
                  Guide
                </span>
              </div>
            </div>

            <div className="p-8 md:p-12 prose prose-slate max-w-none">
              <style dangerouslySetInnerHTML={{ __html: `
                .prose h2 { font-weight: 800; color: #0f172a; margin-top: 2rem; }
                .prose h3 { font-weight: 700; color: #1e293b; margin-top: 1.5rem; }
                .prose ul { list-style-type: none; padding-left: 0; }
                .prose li { position: relative; padding-left: 1.5rem; margin-bottom: 0.75rem; }
                .prose li::before { content: '•'; position: absolute; left: 0; color: #2563eb; font-weight: bold; }
                .prose p { line-height: 1.8; color: #475569; }
              `}} />
              <div dangerouslySetInnerHTML={{ __html: selectedResource.content }} />
              
              <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-slate-400 font-medium">Source: Moorestown Chiro Clinical Archive</p>
                <Button className="rounded-full gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Print Guide
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-2">
              {category ? categoryInfo[category as keyof typeof categoryInfo].title : "Patient Resources"}
            </h1>
            <p className="text-slate-500 font-medium max-w-2xl">
              Equipping you with the knowledge and tools to sustain your wellness journey beyond the clinic doors.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Categories Bar (Desktop) */}
        {!category && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(categoryInfo).map(([key, info]) => (
              <div 
                key={key}
                className={`p-6 rounded-3xl border border-slate-200 bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer group`}
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.set("category", key);
                  window.history.pushState({}, "", url);
                }}
              >
                <div className={`h-12 w-12 rounded-2xl ${info.bg} ${info.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <info.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{info.title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {resources.filter(r => r.category === key).length} active guides available
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div 
              key={resource.id}
              className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/60 transition-all cursor-pointer flex flex-col"
              onClick={() => setSelectedResource(resource)}
            >
              <div className={`p-6 ${categoryInfo[resource.category].bg}`}>
                <resource.icon className={`h-8 w-8 ${categoryInfo[resource.category].color}`} />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-slate-100 text-[9px] uppercase tracking-tighter font-bold text-slate-500">
                    {categoryInfo[resource.category].title}
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{resource.readTime}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                  {resource.description}
                </p>
                <div className="mt-auto flex items-center text-primary font-bold text-xs uppercase tracking-widest">
                  Read Guide
                  <ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="py-20 text-center">
            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No resources found</h3>
            <p className="text-slate-500">Try adjusting your search or category filter.</p>
            <Button 
              variant="link" 
              className="mt-2 text-primary"
              onClick={() => {
                setSearchQuery("");
                const url = new URL(window.location.href);
                url.searchParams.delete("category");
                window.history.pushState({}, "", url);
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Resources;
