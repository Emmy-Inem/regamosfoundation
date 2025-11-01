import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Heart, Users, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  const { data: stats } = useQuery({
    queryKey: ["hero-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("impact_stats")
        .select("*")
        .eq("is_active", true)
        .order("display_order")
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  const { data: content } = useQuery({
    queryKey: ["hero-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("section", "hero");
      if (error) throw error;
      return data?.reduce((acc, item) => ({
        ...acc,
        [item.content_key]: item.content_value,
      }), {} as Record<string, string>);
    },
  });

  const defaultStats = [
    { number: "500+", label: "Widows Empowered" },
    { number: "1000+", label: "Youth Trained" },
    { number: "50+", label: "Communities Reached" },
  ];

  const displayStats = stats && stats.length > 0 ? stats : defaultStats;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Empowering Communities"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background/90" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full blur-glass border border-primary/20 animate-scale-in">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium">
              {content?.hero_badge || "Transforming Lives Since 2018"}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            {content?.hero_heading || (
              <>
                Transforming Lives Through
                <span className="block mt-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Empowerment
                </span>
              </>
            )}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {content?.hero_description || "Regamos Foundation is a faith-based NGO dedicated to empowering widows, orphans, abused girls, and youth through education, skill development, and community support."}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button variant="hero" size="lg" asChild className="group">
              <Link to="/donate">
                <Heart className="h-5 w-5 group-hover:animate-float" />
                Donate Now
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="blur-glass border-primary/30 hover:border-primary/50">
              <Link to="/membership">
                <Users className="h-5 w-5" />
                Become a Member
              </Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto">
            {displayStats.map((stat, index) => (
              <div
                key={index}
                className="blur-glass rounded-lg p-6 shadow-soft hover:shadow-glow transition-smooth animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl font-bold text-accent mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-accent/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-40 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
    </section>
  );
};

export default Hero;
