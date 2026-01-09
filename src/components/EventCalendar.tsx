import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar as CalendarIcon, MapPin, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { format, parseISO, isWithinInterval, startOfDay, endOfDay, addMonths, subMonths, isBefore, isAfter } from "date-fns";

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

  // Get programs for next 2 months only (for the list view)
  const getUpcomingTwoMonthsPrograms = () => {
    if (!programs) return [];
    
    const now = startOfDay(new Date());
    const twoMonthsFromNow = endOfDay(addMonths(now, 2));
    
    return programs.filter((program) => {
      const startDate = parseISO(program.start_date);
      return !isBefore(startDate, now) && !isAfter(startDate, twoMonthsFromNow);
    });
  };

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
  const upcomingTwoMonths = getUpcomingTwoMonthsPrograms();

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
    <section className="py-12 sm:py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Event Calendar</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
            Browse our upcoming programs and events. Click on a date to see what's happening!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Calendar */}
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg">
                {format(currentMonth, "MMMM yyyy")}
              </CardTitle>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={handlePreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center px-2 sm:px-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-md border-0 w-full"
              />
            </CardContent>
            <div className="px-4 sm:px-6 pb-4">
              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-primary/20" />
                  <span>Has Event</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-primary" />
                  <span>Selected</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Event Details */}
          <Card className="shadow-soft">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                {selectedDate ? format(selectedDate, "EEE, MMM d, yyyy") : "Select a date"}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 max-h-[400px] overflow-y-auto">
              {!selectedDate ? (
                <div className="text-center py-6 sm:py-8 text-muted-foreground">
                  <CalendarIcon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                  <p className="text-sm sm:text-base">Click on a date to view events</p>
                </div>
              ) : selectedEvents.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-muted-foreground">
                  <CalendarIcon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                  <p className="text-sm sm:text-base">No events scheduled for this date</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {selectedEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden border">
                      {event.image_url && (
                        <div className="h-24 sm:h-32 overflow-hidden">
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-sm sm:text-lg leading-tight">{event.title}</h3>
                          <Badge className={`${getStatusColor(event.status)} text-xs`}>
                            {event.status}
                          </Badge>
                        </div>
                        
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                          {stripHtml(event.description)}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span>
                            {format(parseISO(event.start_date), "MMM d, yyyy")}
                            {event.end_date && ` - ${format(parseISO(event.end_date), "MMM d, yyyy")}`}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        
                        {event.registration_url && (
                          <Button asChild size="sm" className="w-full mt-2 text-xs sm:text-sm">
                            <a
                              href={event.registration_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2"
                            >
                              Register Now
                              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
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

        {/* Upcoming Events List - Next 2 Months Only */}
        {upcomingTwoMonths.length > 0 && (
          <div className="mt-8 sm:mt-12 max-w-4xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
              Upcoming Events <span className="text-muted-foreground text-base sm:text-lg font-normal">(Next 2 Months)</span>
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {upcomingTwoMonths.map((program) => (
                <Card
                  key={program.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedDate(parseISO(program.start_date));
                    setCurrentMonth(parseISO(program.start_date));
                  }}
                >
                  <CardContent className="p-3 sm:p-4 flex gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                      <span className="text-lg sm:text-2xl font-bold text-primary">
                        {format(parseISO(program.start_date), "d")}
                      </span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground uppercase">
                        {format(parseISO(program.start_date), "MMM")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-sm sm:text-base truncate">{program.title}</h4>
                        <Badge className={`${getStatusColor(program.status)} text-[10px] sm:text-xs flex-shrink-0`}>
                          {program.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{program.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6">
              Click on any date in the calendar above to view all events for that day
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventCalendar;
