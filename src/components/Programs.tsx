import { Link } from "react-router-dom";
import { GraduationCap, Users, HeartHandshake, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import educationImg from "@/assets/education.jpg";
import empowermentImg from "@/assets/empowerment.jpg";
import communityImg from "@/assets/community.jpg";

const Programs = () => {
  const programs = [
    {
      icon: GraduationCap,
      title: "Education & Advocacy",
      description:
        "Providing educational support, scholarships, and advocacy programs to ensure every child has access to quality education.",
      image: educationImg,
      color: "primary",
    },
    {
      icon: Users,
      title: "Widow Empowerment",
      description:
        "Comprehensive support programs including vocational training, microloans, and community building for widows.",
      image: empowermentImg,
      color: "accent",
    },
    {
      icon: HeartHandshake,
      title: "Community Development",
      description:
        "Creating sustainable communities through infrastructure, health initiatives, and economic empowerment programs.",
      image: communityImg,
      color: "primary",
    },
    {
      icon: Lightbulb,
      title: "Youth Skills Training",
      description:
        "Equipping young people with practical skills, mentorship, and opportunities for economic independence and growth.",
      image: educationImg,
      color: "accent",
    },
  ];

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
          {programs.map((program, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-0 shadow-soft hover:shadow-glow transition-smooth animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={program.image}
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
                    <program.icon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>
              <CardContent className="p-8 space-y-4">
                <h3 className="text-2xl font-semibold">{program.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{program.description}</p>
              </CardContent>
            </Card>
          ))}
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
