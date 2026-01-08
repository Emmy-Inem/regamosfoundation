import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar as CalendarIcon, MapPin, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { format, isSameDay, parseISO, isWithinInterval, startOfDay, endOfDay, addMonths, subMonths } from "date-fns";

interface UpcomingProgram {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  location: string;
  status: string;
  image_url: string | null;
  registration_url: string | null;
}

const EventCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const { data: programs, isLoading } = useQuery({
    queryKey: ["calendar-programs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("upcoming_programs")
        .select("*")
        .in("status", ["upcoming", "ongoing"])
        .order("start_date", { ascending: true });
      
      if (error) throw error;
      return data as UpcomingProgram[];
    },
  });

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    if (!programs) return [];
    
    return programs.filter((program) => {
      const startDate = startOfDay(parseISO(program.start_date));
      const endDate = program.end_date 
        ? endOfDay(parseISO(program.end_date))
        : endOfDay(startDate);
      
      return isWithinInterval(date, { start: startDate, end: endDate });
    });
  };

  // Get dates that have events
  const getEventDates = () => {
    if (!programs) return [];
    
    const dates: Date[] = [];
    programs.forEach((program) => {
      const startDate = parseISO(program.start_date);
      dates.push(startDate);
    });
    
    return dates;
  };

  // Custom day content to show event indicators
  const modifiers = {
    hasEvent: getEventDates(),
  };

  const modifiersStyles = {
    hasEvent: {
      backgroundColor: "hsl(var(--primary) / 0.2)",
      borderRadius: "100%",
    },
  };

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500";
      case "ongoing":
        return "bg-green-500";
      default:
        return "bg-muted";
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Event Calendar</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our upcoming programs and events. Click on a date to see what's happening!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Calendar */}
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">
                {format(currentMonth, "MMMM yyyy")}
              </CardTitle>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-md border-0"
              />
            </CardContent>
            <div className="px-6 pb-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary/20" />
                  <span>Has Event</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span>Selected</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Event Details */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "Select a date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedDate ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Click on a date to view events</p>
                </div>
              ) : selectedEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No events scheduled for this date</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden border">
                      {event.image_url && (
                        <div className="h-32 overflow-hidden">
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-lg leading-tight">{event.title}</h3>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {stripHtml(event.description)}
                        </p>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarIcon className="h-4 w-4" />
                          <span>
                            {format(parseISO(event.start_date), "MMM d, yyyy")}
                            {event.end_date && ` - ${format(parseISO(event.end_date), "MMM d, yyyy")}`}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                        
                        {event.registration_url && (
                          <Button asChild size="sm" className="w-full mt-2">
                            <a
                              href={event.registration_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2"
                            >
                              Register Now
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events List */}
        {programs && programs.length > 0 && (
          <div className="mt-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">All Upcoming Events</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {programs.map((program) => (
                <Card
                  key={program.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedDate(parseISO(program.start_date))}
                >
                  <CardContent className="p-4 flex gap-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {format(parseISO(program.start_date), "d")}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase">
                        {format(parseISO(program.start_date), "MMM")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold truncate">{program.title}</h4>
                        <Badge className={`${getStatusColor(program.status)} text-xs`}>
                          {program.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{program.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventCalendar;
