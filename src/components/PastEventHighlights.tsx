import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, MapPin, Images, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

type EventHighlight = {
  id: string;
  title: string;
  description: string;
  gallery_urls?: string[] | null;
  image_url?: string | null;
  location: string;
  start_date: string;
  end_date?: string | null;
};

interface Props {
  limit?: number;
  showSeeMore?: boolean;
}

const PastEventHighlights = ({ limit = 8, showSeeMore = true }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: events, isLoading } = useQuery({
    queryKey: ["past-event-highlights", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("upcoming_programs")
        .select("id,title,description,gallery_urls,image_url,location,start_date,end_date")
        .eq("status", "completed")
        .order("start_date", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as EventHighlight[];
    },
  });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

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
    <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between gap-4 mb-8 sm:mb-10">
          <div className="max-w-2xl">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-3">
              Past Event Highlights
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Moments From Our Recent Programs
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Swipe through recent events. Tap any highlight to view the full gallery and story.
            </p>
          </div>
          <div className="hidden md:flex gap-2 shrink-0">
            <Button variant="outline" size="icon" onClick={() => scroll("left")} aria-label="Scroll left">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll("right")} aria-label="Scroll right">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scroll-smooth [scrollbar-width:thin]"
        >
          {events.map((e) => {
            const cover = e.image_url || e.gallery_urls?.[0];
            const count = (e.image_url ? 1 : 0) + (e.gallery_urls?.length || 0);
            return (
              <Link
                key={e.id}
                to={`/events/${e.id}`}
                className="block shrink-0 snap-start w-[85%] sm:w-[380px]"
              >
                <Card className="group cursor-pointer overflow-hidden border-0 shadow-soft hover:shadow-glow transition-smooth h-full">
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
              </Link>
            );
          })}
        </div>

        {showSeeMore && (
          <div className="text-center mt-8">
            <Button asChild variant="cta" size="lg">
              <Link to="/programs">
                See More Past Events <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PastEventHighlights;
