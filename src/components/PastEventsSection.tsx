import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, MapPin } from "lucide-react";

const PastEventsSection = () => {
  const { data: programs, isLoading } = useQuery({
    queryKey: ["past-programs-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("upcoming_programs")
        .select("*")
        .eq("status", "completed")
        .order("start_date", { ascending: false })
        .limit(12);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (!programs || programs.length === 0) return null;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Past Events</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
            Look back at the programs and gatherings we have hosted this year
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {programs.map((p) => (
            <Card key={p.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {p.image_url && (
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={p.image_url}
                    alt={p.title}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-4 sm:p-6">
                <Badge className="bg-muted-foreground mb-3">Completed</Badge>
                <h3 className="font-semibold text-base sm:text-lg lg:text-xl mb-2 line-clamp-2">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 mb-3">
                  {stripHtml(p.description)}
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                    <span className="truncate">
                      {formatDate(p.start_date)}
                      {p.end_date && ` - ${formatDate(p.end_date)}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                    <span className="truncate">{p.location}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PastEventsSection;
