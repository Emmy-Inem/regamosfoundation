import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, MapPin, ExternalLink, ChevronDown } from "lucide-react";
import EventSchema from "@/components/schemas/EventSchema";
import { addMonths, startOfDay, endOfDay, parseISO, isBefore, isAfter } from "date-fns";

const UpcomingProgramsSection = () => {
  const [monthsToShow, setMonthsToShow] = useState(2);

  const { data: allPrograms, isLoading } = useQuery({
    queryKey: ["upcoming-programs-public-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("upcoming_programs")
        .select("*")
        .in("status", ["upcoming", "ongoing"])
        .order("start_date", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Filter programs to show only within the selected month range
  const getFilteredPrograms = () => {
    if (!allPrograms) return [];
    
    const now = startOfDay(new Date());
    const endDate = endOfDay(addMonths(now, monthsToShow));
    const endOfYear = endOfDay(new Date(now.getFullYear(), 11, 31));
    
    return allPrograms.filter((program) => {
      const startDate = parseISO(program.start_date);
      return !isBefore(startDate, now) && !isAfter(startDate, endDate);
    });
  };

  // Check if there are more programs to show
  const hasMorePrograms = () => {
    if (!allPrograms) return false;
    
    const now = startOfDay(new Date());
    const currentEndDate = endOfDay(addMonths(now, monthsToShow));
    const endOfYear = endOfDay(new Date(now.getFullYear(), 11, 31));
    
    // Check if we've reached end of year
    if (currentEndDate >= endOfYear) return false;
    
    // Check if there are programs beyond current view but within the year
    return allPrograms.some((program) => {
      const startDate = parseISO(program.start_date);
      return isAfter(startDate, currentEndDate) && !isAfter(startDate, endOfYear);
    });
  };

  const handleShowMore = () => {
    setMonthsToShow((prev) => prev + 2);
  };

  const programs = getFilteredPrograms();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!programs || programs.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500';
      case 'ongoing':
        return 'bg-green-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <section className="py-20 bg-muted/30">
      {/* Event Schema for each program */}
      {programs.map((program) => (
        <EventSchema
          key={`schema-${program.id}`}
          name={program.title}
          description={stripHtml(program.description)}
          startDate={program.start_date}
          endDate={program.end_date || undefined}
          location={program.location}
          image={program.image_url || undefined}
          url={program.registration_url || undefined}
          status={program.status === 'ongoing' ? 'EventScheduled' : 'EventScheduled'}
        />
      ))}
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Programs & Events</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join us in our upcoming initiatives and be part of the change
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <Card key={program.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {program.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={program.image_url}
                    alt={program.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getStatusColor(program.status)}>
                    {program.status}
                  </Badge>
                </div>

                <h3 className="font-semibold text-xl mb-3">{program.title}</h3>
                
                <div 
                  className="text-sm text-muted-foreground mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: program.description }}
                />
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>
                      {formatDate(program.start_date)}
                      {program.end_date && ` - ${formatDate(program.end_date)}`}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{program.location}</span>
                  </div>
                </div>

                {program.registration_url && (
                  <Button asChild className="w-full">
                    <a
                      href={program.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      Register Now
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {hasMorePrograms() && (
          <div className="flex justify-center mt-8">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleShowMore}
              className="gap-2"
            >
              See More Events
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingProgramsSection;
