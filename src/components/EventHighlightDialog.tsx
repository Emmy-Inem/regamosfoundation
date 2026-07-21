import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar, MapPin, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type EventHighlight = {
  id: string;
  title: string;
  description: string;
  highlight_writeup?: string | null;
  gallery_urls?: string[] | null;
  image_url?: string | null;
  location: string;
  start_date: string;
  end_date?: string | null;
};

type Props = {
  event: EventHighlight | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const EventHighlightDialog = ({ event, open, onOpenChange }: Props) => {
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (!open) setLightbox(null);
  }, [open]);

  if (!event) return null;

  const gallery: string[] = [
    ...(event.image_url ? [event.image_url] : []),
    ...((event.gallery_urls || []).filter((u) => u && u !== event.image_url)),
  ];

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const writeup = event.highlight_writeup?.trim() || event.description;

  const next = () =>
    setLightbox((i) => (i === null ? 0 : (i + 1) % gallery.length));
  const prev = () =>
    setLightbox((i) =>
      i === null ? 0 : (i - 1 + gallery.length) % gallery.length
    );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl leading-tight pr-8">
              {event.title}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-muted-foreground pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" />
                  {formatDate(event.start_date)}
                  {event.end_date && ` – ${formatDate(event.end_date)}`}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary" />
                  {event.location}
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>

          {gallery.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {gallery.map((url, i) => (
                <button
                  key={url + i}
                  type="button"
                  onClick={() => setLightbox(i)}
                  className="group relative aspect-square overflow-hidden rounded-md bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <img
                    src={url}
                    alt={`${event.title} photo ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                  />
                </button>
              ))}
            </div>
          )}

          {writeup && (
            <div
              className="prose prose-sm sm:prose-base max-w-none mt-4 text-foreground [&_p]:text-foreground [&_li]:text-foreground"
              dangerouslySetInnerHTML={{ __html: writeup }}
            />
          )}
        </DialogContent>
      </Dialog>

      {lightbox !== null && gallery[lightbox] && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
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
                  prev();
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
                  next();
                }}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}
          <img
            src={gallery[lightbox]}
            alt={`${event.title} photo ${lightbox + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 text-white/80 text-sm">
            {lightbox + 1} / {gallery.length}
          </div>
        </div>
      )}
    </>
  );
};

export default EventHighlightDialog;
