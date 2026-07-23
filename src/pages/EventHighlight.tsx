import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowLeft, ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react";

const EventHighlight = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lightbox, setLightbox] = useState<number | null>(null);

  const { data: event, isLoading } = useQuery({
    queryKey: ["event-highlight", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("upcoming_programs")
        .select(
          "id,title,description,highlight_writeup,gallery_urls,image_url,location,start_date,end_date"
        )
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const gallery: string[] = event
    ? [
        ...(event.image_url ? [event.image_url] : []),
        ...((event.gallery_urls || []).filter((u: string) => u && u !== event.image_url)),
      ]
    : [];

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? 0 : (i + 1) % gallery.length));
      if (e.key === "ArrowLeft")
        setLightbox((i) => (i === null ? 0 : (i - 1 + gallery.length) % gallery.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, gallery.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Event not found</h1>
          <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const writeup = event.highlight_writeup?.trim() || event.description;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${event.title} – Event Highlight`}
        description={(event.description || "").replace(/<[^>]+>/g, "").slice(0, 155)}
        image={event.image_url || undefined}
      />
      <Navigation />

      <main className="container mx-auto px-4 py-8 sm:py-12 max-w-5xl">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              {formatDate(event.start_date)}
              {event.end_date && ` – ${formatDate(event.end_date)}`}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {event.location}
            </span>
          </div>
        </header>

        {gallery.length > 0 && (
          <section className="mb-10">
            {gallery[0] && (
              <button
                type="button"
                onClick={() => setLightbox(0)}
                className="block w-full mb-3 overflow-hidden rounded-lg bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <img
                  src={gallery[0]}
                  alt={`${event.title} – featured`}
                  className="w-full max-h-[70vh] object-cover hover:scale-[1.02] transition-smooth"
                />
              </button>
            )}
            {gallery.length > 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                {gallery.slice(1).map((url, i) => (
                  <button
                    key={url + i}
                    type="button"
                    onClick={() => setLightbox(i + 1)}
                    className="group relative aspect-square overflow-hidden rounded-md bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <img
                      src={url}
                      alt={`${event.title} photo ${i + 2}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {writeup && (
          <article
            className="prose prose-lg max-w-none text-foreground [&_p]:text-foreground [&_li]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground"
            dangerouslySetInnerHTML={{ __html: writeup }}
          />
        )}
      </main>

      <Footer />

      {lightbox !== null && gallery[lightbox] && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
          >
            <X className="h-6 w-6" />
          </Button>
          {gallery.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 sm:left-6 text-white hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((i) => (i === null ? 0 : (i - 1 + gallery.length) % gallery.length));
                }}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 sm:right-6 text-white hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((i) => (i === null ? 0 : (i + 1) % gallery.length));
                }}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}
          <img
            src={gallery[lightbox]}
            alt={`${event.title} photo ${lightbox + 1}`}
            className="max-h-[90vh] max-w-[92vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 text-white/80 text-sm">
            {lightbox + 1} / {gallery.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventHighlight;
