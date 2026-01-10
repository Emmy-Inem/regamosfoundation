import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { addMonths, startOfDay, endOfDay, parseISO, isBefore, isAfter } from "date-fns";

const HomeUpcomingEvents = () => {
  const { data: programs, isLoading } = useQuery({
    queryKey: ["home-upcoming-programs"],
    queryFn: async () => {
      const now = startOfDay(new Date());
      const endDate = endOfDay(addMonths(now, 1));
      
      const { data, error } = await supabase
        .from("upcoming_programs")
        .select("*")
        .in("status", ["upcoming", "ongoing"])
        .gte("start_date", now.toISOString())
        .lte("start_date", endDate.toISOString())
        .order("start_date", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
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

  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Upcoming Events</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
            Join us in our upcoming initiatives and be part of the change
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {programs.slice(0, 6).map((program) => (
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
              
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <Badge className={getStatusColor(program.status)}>
                    {program.status}
                  </Badge>
                </div>

                <h3 className="font-semibold text-base sm:text-lg lg:text-xl mb-2 sm:mb-3 line-clamp-2">{program.title}</h3>
                
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                    <span className="truncate">
                      {formatDate(program.start_date)}
                      {program.end_date && ` - ${formatDate(program.end_date)}`}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                    <span className="truncate">{program.location}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-8 sm:mt-10">
          <Button variant="cta" size="lg" asChild className="gap-2">
            <Link to="/programs">
              See More Events
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HomeUpcomingEvents;
