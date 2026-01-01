import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Target, Eye, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Mission = () => {
  const { data: content } = useQuery({
    queryKey: ["mission-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("section", "mission");
      if (error) throw error;
      return data?.reduce((acc, item) => ({
        ...acc,
        [item.content_key]: item.content_value,
      }), {} as Record<string, string>);
    },
  });

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: content?.mission_text ||
        "To improve the livelihood of widows, young people, abused girls and the less privileged through Advocacy, Education, Economic Empowerment, Psychological Support, Entrepreneurship Training and Community Development Initiatives.",
    },
    {
      icon: Eye,
      title: "Our Vision",
      description: content?.vision_text ||
        "Transforming lives through empowerment.",
    },
    {
      icon: Heart,
      title: "Our Values",
      description: content?.values_text ||
        "Love and Compassion, Obedience to God's call, Long Term Commitment, Respect for every Individual, Partnership, Teamwork, Integrity and Accountability.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
            {content?.mission_title || (
              <>Love in <span className="text-primary">Action</span></>
            )}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            {content?.mission_subtitle ? (
              <span dangerouslySetInnerHTML={{ __html: content.mission_subtitle }} />
            ) : (
              "Founded in 2018 and incorporated in 2020, we are committed to making a lasting impact in the lives of those who need it most."
            )}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {values.map((value, index) => (
            <Card
              key={index}
              className="border-0 shadow-soft hover:shadow-glow transition-smooth animate-fade-in-up bg-card/80 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-5 sm:p-6 md:p-8 text-center space-y-3 sm:space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary/10 mb-2 sm:mb-4">
                  <value.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">{value.title}</h3>
                <div 
                  className="text-sm sm:text-base text-muted-foreground leading-relaxed prose prose-sm max-w-none mx-auto"
                  dangerouslySetInnerHTML={{ __html: value.description }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Mission;
