import { Target, Eye, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Mission = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To empower widows, orphans, abused girls, and youth through education, advocacy, and community development, fostering dignity and self-sufficiency.",
    },
    {
      icon: Eye,
      title: "Our Vision",
      description:
        "A world where every vulnerable person has access to opportunities, support, and the resources needed to thrive and reach their full potential.",
    },
    {
      icon: Heart,
      title: "Our Values",
      description:
        "Compassion, integrity, empowerment, faith, and community - these core principles guide every action we take and every life we touch.",
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Love in <span className="text-primary">Action</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Founded in 2018 and incorporated in 2020, we are committed to making a lasting impact 
            in the lives of those who need it most.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card
              key={index}
              className="border-0 shadow-soft hover:shadow-glow transition-smooth animate-fade-in-up bg-card/80 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Mission;
