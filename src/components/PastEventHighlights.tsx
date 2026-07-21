import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, MapPin, Images, ArrowRight } from "lucide-react";
import EventHighlightDialog, { type EventHighlight } from "./EventHighlightDialog";

const PastEventHighlights = () => {
  const [selected, setSelected] = useState<EventHighlight | null>(null);

  const { data: events, isLoading } = useQuery({
    queryKey: ["past-event-highlights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("upcoming_programs")
        .select(
          "id,title,description,highlight_writeup,gallery_urls,image_url,location,start_date,end_date"
        )
        .eq("status", "completed")
        .order("start_date", { ascending: false })
        .limit(12);
      if (error) throw error;
      return data as EventHighlight[];
    },
  });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (!events || events.length === 0) return null;

  return (
    <>
      <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-12 max-w-2xl mx-auto">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-3">
              Past Event Highlights
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Moments From Our Recent Programs
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Tap any highlight to open the photo gallery and read the full story from the event.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {events.map((e) => {
              const cover = e.image_url || e.gallery_urls?.[0];
              const count = e.gallery_urls?.length || 0;
              return (
                <Card
                  key={e.id}
                  onClick={() => setSelected(e)}
                  className="group cursor-pointer overflow-hidden border-0 shadow-soft hover:shadow-glow transition-smooth"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    {cover ? (
                      <img
                        src={cover}
                        alt={e.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 text-muted-foreground text-sm">
                        No image
                      </div>
                    )}
                    {count > 0 && (
                      <Badge className="absolute top-3 right-3 bg-background/90 text-foreground shadow">
                        <Images className="h-3.5 w-3.5 mr-1" />
                        {count} photo{count === 1 ? "" : "s"}
                      </Badge>
                    )}
                  </div>
                  <div className="p-4 sm:p-5 space-y-2">
                    <h3 className="font-semibold text-base sm:text-lg line-clamp-2">{e.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>
                        {formatDate(e.start_date)}
                        {e.end_date && ` – ${formatDate(e.end_date)}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span className="truncate">{e.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-primary pt-1 group-hover:gap-2 transition-all">
                      View highlight <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <EventHighlightDialog
        event={selected}
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
      />
    </>
  );
};

export default PastEventHighlights;
