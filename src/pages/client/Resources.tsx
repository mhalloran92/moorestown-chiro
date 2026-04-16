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
  ExternalLink,
  ChevronLeft,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Resource {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  icon_name: string;
}

const iconMap: Record<string, any> = {
  BookOpen,
  Move,
  Apple
};

const categoryInfo = {
  clinical: { title: "Clinical Guides", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
  mobility: { title: "Specialized Mobility Techniques", icon: Move, color: "text-purple-600", bg: "bg-purple-50" },
  nutrition: { title: "Nutritional Wellness", icon: Apple, color: "text-emerald-600", bg: "bg-emerald-50" },
};

const Resources = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchResources();
  }, []);

  // Clear selected resource when category changes from sidebar
  useEffect(() => {
    setSelectedResource(null);
  }, [category]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      console.log("Fetched resources:", data); // Debug log
      setResources(data || []);
    } catch (error: any) {
      console.error("Error fetching resources:", error);
      toast.error("Failed to load resources: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter(r => {
    // Normalize category for matching
    const resourceCat = r.category?.toLowerCase();
    const activeCat = category?.toLowerCase();
    
    const matchesCategory = !activeCat || resourceCat === activeCat;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (selectedResource) {
    const IconComponent = iconMap[selectedResource.icon_name] || BookOpen;
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
            <div className={`p-8 md:p-12 ${categoryInfo[selectedResource.category as keyof typeof categoryInfo]?.bg || 'bg-slate-50'}`}>
              <Badge className="mb-4 bg-white/80 backdrop-blur-sm text-primary border-none text-[10px] font-bold tracking-widest uppercase">
                {categoryInfo[selectedResource.category as keyof typeof categoryInfo]?.title || 'Resource'}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">
                {selectedResource.title}
              </h1>
              <div className="flex items-center gap-6 text-slate-900 font-bold text-sm">
                <span className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5 text-primary" />
                  Clinical Resource
                </span>
              </div>
            </div>

            <div className="p-8 md:p-12 prose prose-slate max-w-none">
              <style dangerouslySetInnerHTML={{ __html: `
                .prose h2 { font-weight: 800; color: #0f172a; margin-top: 2rem; }
                .prose h3 { font-weight: 700; color: #1e293b; margin-top: 1.5rem; }
                .prose ul { list-style-type: none; padding-left: 0; }
                .prose li { position: relative; padding-left: 1.5rem; margin-bottom: 0.75rem; color: #0f172a; font-weight: 500; }
                .prose li::before { content: '•'; position: absolute; left: 0; color: #2563eb; font-weight: bold; }
                .prose p { line-height: 1.8; color: #0f172a; font-weight: 500; font-size: 1.05rem; }
                .prose strong { color: #000; font-weight: 800; }
              `}} />
              <div dangerouslySetInnerHTML={{ __html: selectedResource.content }} />
              
              <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-slate-400 font-medium">Source: Moorestown Chiro Clinical Archive</p>
                <Button className="rounded-full gap-2" onClick={() => window.print()}>
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
              {category ? categoryInfo[category as keyof typeof categoryInfo]?.title : "Patient Resources"}
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
        {!category && !loading && (
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

        {/* Resources Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm h-64">
                <Skeleton className="h-32 w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredResources.length === 0 ? (
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
        ) : (
          <div className="space-y-12">
            {/* If a category is selected, just show that grid. If not, show grouped sections */}
            {(category ? [category] : Object.keys(categoryInfo)).map((catKey) => {
              const catResources = filteredResources.filter(r => r.category === catKey);
              if (catResources.length === 0) return null;
              const info = categoryInfo[catKey as keyof typeof categoryInfo];

              return (
                <div key={catKey} className="space-y-6">
                  {!category && (
                    <div className="flex items-center gap-3">
                      <div className={`h-1 w-8 rounded-full ${info.color.replace('text', 'bg')}`} />
                      <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{info.title}</h2>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catResources.map((resource) => {
                      const IconComponent = iconMap[resource.icon_name] || BookOpen;
                      const cat = categoryInfo[resource.category as keyof typeof categoryInfo] || { bg: 'bg-slate-50', color: 'text-slate-600', title: 'Guide' };
                      
                      return (
                        <div 
                          key={resource.id}
                          className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/60 transition-all cursor-pointer flex flex-col"
                          onClick={() => setSelectedResource(resource)}
                        >
                          <div className={`p-6 ${cat.bg}`}>
                            <IconComponent className={`h-8 w-8 ${cat.color}`} />
                          </div>
                          <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="secondary" className="bg-slate-100 text-[9px] uppercase tracking-tighter font-bold text-slate-900 border-slate-200">
                                {cat.title}
                              </Badge>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                              {resource.title}
                            </h3>
                            <p className="text-sm text-slate-700 font-bold leading-relaxed mb-6 line-clamp-2">
                              {resource.description}
                            </p>
                            <div className="mt-auto flex items-center text-primary font-bold text-xs uppercase tracking-widest">
                              Read Guide
                              <ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Resources;
