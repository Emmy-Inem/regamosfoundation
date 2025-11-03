import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import educationImg from "@/assets/education.jpg";
import empowermentImg from "@/assets/empowerment.jpg";
import communityImg from "@/assets/community.jpg";

const Programs = () => {
  const { data: programs, isLoading } = useQuery({
    queryKey: ["programs-preview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("is_active", true)
        .order("display_order")
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  const defaultPrograms = [
    {
      icon_name: "GraduationCap",
      title: "Education & Advocacy",
      description:
        "Providing educational support, scholarships, and advocacy programs to ensure every child has access to quality education.",
      image_url: educationImg,
      color: "primary",
    },
    {
      icon_name: "Users",
      title: "Widow Empowerment",
      description:
        "Comprehensive support programs including vocational training, microloans, and community building for widows.",
      image_url: empowermentImg,
      color: "accent",
    },
    {
      icon_name: "HeartHandshake",
      title: "Community Development",
      description:
        "Creating sustainable communities through infrastructure, health initiatives, and economic empowerment programs.",
      image_url: communityImg,
      color: "primary",
    },
    {
      icon_name: "Lightbulb",
      title: "Youth Skills Training",
      description:
        "Equipping young people with practical skills, mentorship, and opportunities for economic independence and growth.",
      image_url: educationImg,
      color: "accent",
    },
  ];

  const displayPrograms = programs && programs.length > 0 ? programs : defaultPrograms;

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Heart;
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-primary">Programs</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive initiatives designed to create lasting change and empower communities
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {isLoading ? (
            Array(4).fill(0).map((_, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-soft">
                <Skeleton className="h-64 w-full" />
                <CardContent className="p-8 space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            displayPrograms.map((program, index) => {
              const Icon = getIcon(program.icon_name);
              const imageUrl = program.image_url || educationImg;
              
              return (
                <Card
                  key={index}
                  className="group overflow-hidden border-0 shadow-soft hover:shadow-glow transition-smooth animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <div
                        className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${
                          program.color === "primary" ? "bg-primary" : "bg-accent"
                        } shadow-glow`}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-8 space-y-4">
                    <h3 className="text-2xl font-semibold">{program.title}</h3>
                    <div 
                      className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: program.description }}
                    />
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <div className="text-center animate-fade-in">
          <Button variant="cta" size="lg" asChild>
            <Link to="/programs">Explore All Programs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Programs;
