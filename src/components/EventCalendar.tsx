import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Calendar as CalendarIcon, MapPin, ChevronLeft, ChevronRight, UserPlus, Check, ChevronDown } from "lucide-react";
import { format, parseISO, isWithinInterval, startOfDay, endOfDay, addMonths, subMonths, isBefore, isAfter } from "date-fns";
import { toast } from "sonner";
import { z } from "zod";

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

const registrationSchema = z.object({
  full_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email is too long"),
  phone: z.string().trim().max(20, "Phone number is too long").optional(),
});

const EventCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<UpcomingProgram | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [formData, setFormData] = useState({ full_name: "", email: "", phone: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

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

  const registerMutation = useMutation({
    mutationFn: async (data: { program_id: string; full_name: string; email: string; phone?: string }) => {
      const { error } = await supabase
        .from("event_registrations")
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Registration successful! We'll send you event details soon.");
      setShowRegistration(false);
      setFormData({ full_name: "", email: "", phone: "" });
      setFormErrors({});
      queryClient.invalidateQueries({ queryKey: ["event-registrations"] });
    },
    onError: () => {
      toast.error("Registration failed. Please try again.");
    },
  });

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const result = registrationSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    if (!selectedEvent) return;

    registerMutation.mutate({
      program_id: selectedEvent.id,
      full_name: result.data.full_name,
      email: result.data.email,
      phone: result.data.phone || undefined,
    });
  };

  const [eventsMonthsToShow, setEventsMonthsToShow] = useState(2);

  // Get programs for the list view based on months to show
  const getUpcomingPrograms = () => {
    if (!programs) return [];
    
    const now = startOfDay(new Date());
    const endDate = endOfDay(addMonths(now, eventsMonthsToShow));
    
    return programs.filter((program) => {
      const startDate = parseISO(program.start_date);
      return !isBefore(startDate, now) && !isAfter(startDate, endDate);
    });
  };

  // Check if there are more programs to show
  const hasMoreEventsToShow = () => {
    if (!programs) return false;
    
    const now = startOfDay(new Date());
    const currentEndDate = endOfDay(addMonths(now, eventsMonthsToShow));
    const endOfYear = endOfDay(new Date(now.getFullYear(), 11, 31));
    
    if (currentEndDate >= endOfYear) return false;
    
    return programs.some((program) => {
      const startDate = parseISO(program.start_date);
      return isAfter(startDate, currentEndDate) && !isAfter(startDate, endOfYear);
    });
  };

  const handleShowMoreEvents = () => {
    setEventsMonthsToShow((prev) => prev + 2);
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
  const upcomingPrograms = getUpcomingPrograms();

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

  const openEventDetails = (event: UpcomingProgram) => {
    setSelectedEvent(event);
    setShowRegistration(false);
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
                    <Card 
                      key={event.id} 
                      className="overflow-hidden border cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => openEventDetails(event)}
                    >
                      {event.image_url && (
                        <div className="h-24 sm:h-32 overflow-hidden">
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-3 sm:p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-sm sm:text-lg leading-tight">{event.title}</h3>
                          <Badge className={`${getStatusColor(event.status)} text-xs`}>
                            {event.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span>{event.location}</span>
                        </div>
                        
                        <p className="text-xs text-primary font-medium">Click to view full details & register</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events List */}
        {upcomingPrograms.length > 0 && (
          <div className="mt-8 sm:mt-12 max-w-4xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
              Upcoming Events
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {upcomingPrograms.map((program) => (
                <Card
                  key={program.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => openEventDetails(program)}
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
                        <h4 className="font-semibold text-sm sm:text-base line-clamp-1">{program.title}</h4>
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
            
            {hasMoreEventsToShow() && (
              <div className="flex justify-center mt-6">
                <Button 
                  variant="outline" 
                  onClick={handleShowMoreEvents}
                  className="gap-2"
                >
                  See More Events
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6">
              Click on any event to view full details and register
            </p>
          </div>
        )}
      </div>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl pr-6">{selectedEvent.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 pt-2">
                  <Badge className={getStatusColor(selectedEvent.status)}>
                    {selectedEvent.status}
                  </Badge>
                </DialogDescription>
              </DialogHeader>

              {!showRegistration ? (
                <div className="space-y-3 sm:space-y-4">
                  {selectedEvent.image_url && (
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={selectedEvent.image_url}
                        alt={selectedEvent.title}
                        className="w-full h-36 sm:h-48 object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-start gap-2 text-xs sm:text-sm">
                      <CalendarIcon className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Date: </span>
                        <span className="break-words">
                          {format(parseISO(selectedEvent.start_date), "EEE, MMM d, yyyy")}
                          {selectedEvent.end_date && ` - ${format(parseISO(selectedEvent.end_date), "MMM d, yyyy")}`}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 text-xs sm:text-sm">
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Location: </span>
                        <span className="break-words">{selectedEvent.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-3 sm:pt-4">
                    <h4 className="font-semibold mb-2 text-sm sm:text-base">About This Event</h4>
                    <div 
                      className="text-xs sm:text-sm text-muted-foreground prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedEvent.description }}
                    />
                  </div>

                  <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                    <Button onClick={() => setShowRegistration(true)} className="flex-1 text-sm">
                      <UserPlus className="h-4 w-4 mr-1.5 sm:mr-2" />
                      Register
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegistrationSubmit} className="space-y-3 sm:space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="full_name" className="text-sm">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Enter your full name"
                      className={`text-sm ${formErrors.full_name ? "border-destructive" : ""}`}
                    />
                    {formErrors.full_name && (
                      <p className="text-xs text-destructive">{formErrors.full_name}</p>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="email" className="text-sm">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email"
                      className={`text-sm ${formErrors.email ? "border-destructive" : ""}`}
                    />
                    {formErrors.email && (
                      <p className="text-xs text-destructive">{formErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="phone" className="text-sm">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      className={`text-sm ${formErrors.phone ? "border-destructive" : ""}`}
                    />
                    {formErrors.phone && (
                      <p className="text-xs text-destructive">{formErrors.phone}</p>
                    )}
                  </div>

                  <div className="flex gap-2 sm:gap-3 pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowRegistration(false)}
                      className="flex-1 text-sm"
                    >
                      Back
                    </Button>
                    <Button type="submit" className="flex-1 text-sm" disabled={registerMutation.isPending}>
                      {registerMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                      ) : (
                        <Check className="h-4 w-4 mr-1.5" />
                      )}
                      Submit
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default EventCalendar;