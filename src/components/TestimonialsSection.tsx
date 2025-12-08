import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2, Star, Quote } from "lucide-react";
import TestimonialSchema from "@/components/schemas/TestimonialSchema";

const TestimonialsSection = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["testimonials-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <>
      <TestimonialSchema 
        testimonials={testimonials} 
        itemReviewed={{ name: "Regamos Foundation", type: "Organization" }} 
      />
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">What People Say</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Hear from those whose lives have been transformed by our programs
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow relative">
                <Quote className="absolute top-3 right-3 sm:top-4 sm:right-4 h-6 w-6 sm:h-8 sm:w-8 text-primary/20" />
                
                <div className="flex items-center gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 italic line-clamp-4 sm:line-clamp-none">
                  "{testimonial.testimonial_text}"
                </p>

                <div className="flex items-center gap-3 sm:gap-4">
                  {testimonial.author_image_url ? (
                    <img
                      src={testimonial.author_image_url}
                      alt={testimonial.author_name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-base sm:text-lg font-semibold text-primary">
                        {testimonial.author_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-sm sm:text-base truncate">{testimonial.author_name}</p>
                    {testimonial.author_role && (
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{testimonial.author_role}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TestimonialsSection;
