import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  Users, 
  HeartHandshake, 
  Lightbulb, 
  BookOpen,
  Briefcase,
  Heart,
  Home
} from "lucide-react";
import educationImg from "@/assets/education.jpg";
import empowermentImg from "@/assets/empowerment.jpg";
import communityImg from "@/assets/community.jpg";

const Programs = () => {
  const programs = [
    {
      icon: GraduationCap,
      title: "Education & Advocacy",
      description:
        "We provide comprehensive educational support including scholarships, school supplies, tutoring, and mentorship programs. Our advocacy efforts ensure that every child has access to quality education regardless of their circumstances.",
      image: educationImg,
      color: "primary",
      features: [
        "Scholarship programs for orphans and vulnerable children",
        "School supplies and uniforms distribution",
        "After-school tutoring and mentorship",
        "Advocacy for educational rights and access"
      ]
    },
    {
      icon: Users,
      title: "Widow Empowerment",
      description:
        "Our widow empowerment program provides comprehensive support including vocational training, microloans, business development, and community building to help widows achieve economic independence and dignity.",
      image: empowermentImg,
      color: "accent",
      features: [
        "Vocational skills training (tailoring, catering, crafts)",
        "Microfinance and business development support",
        "Psychological counseling and support groups",
        "Community building and networking opportunities"
      ]
    },
    {
      icon: HeartHandshake,
      title: "Community Development",
      description:
        "We work to create sustainable communities through infrastructure improvements, health initiatives, economic empowerment programs, and capacity building for local organizations.",
      image: communityImg,
      color: "primary",
      features: [
        "Infrastructure development projects",
        "Health awareness and medical outreach",
        "Economic empowerment initiatives",
        "Capacity building for local organizations"
      ]
    },
    {
      icon: Lightbulb,
      title: "Youth Skills Training",
      description:
        "Our youth program equips young people with practical skills, entrepreneurship training, and leadership development opportunities to ensure they can build successful futures.",
      image: educationImg,
      color: "accent",
      features: [
        "Digital skills and computer training",
        "Entrepreneurship and business skills",
        "Leadership development programs",
        "Job placement and career guidance"
      ]
    },
    {
      icon: Heart,
      title: "Psychological Support",
      description:
        "We provide trauma counseling, mental health support, and resilience-building programs for victims of abuse and those dealing with grief and loss.",
      image: communityImg,
      color: "primary",
      features: [
        "One-on-one counseling sessions",
        "Group therapy and support groups",
        "Trauma recovery programs",
        "Mental health awareness campaigns"
      ]
    },
    {
      icon: Home,
      title: "Shelter & Protection",
      description:
        "Safe shelter and protection services for abused girls and vulnerable women, providing a secure environment for healing and recovery.",
      image: empowermentImg,
      color: "accent",
      features: [
        "Emergency shelter and safe houses",
        "Legal support and advocacy",
        "Rehabilitation and reintegration programs",
        "24/7 crisis intervention hotline"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold">
                Our <span className="text-primary">Programs</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Comprehensive initiatives designed to create lasting change and empower communities across Nigeria
              </p>
            </div>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="space-y-16">
              {programs.map((program, index) => (
                <Card
                  key={index}
                  className={`overflow-hidden border-0 shadow-soft hover:shadow-glow transition-smooth animate-fade-in-up ${
                    index % 2 === 0 ? "" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                    <div className={`relative h-80 lg:h-auto ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                      <img
                        src={program.image}
                        alt={program.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
                      <div className="absolute top-8 left-8">
                        <div
                          className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
                            program.color === "primary" ? "bg-primary" : "bg-accent"
                          } shadow-glow`}
                        >
                          <program.icon className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>
                    <CardContent className={`p-8 lg:p-12 flex flex-col justify-center ${index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">{program.title}</h2>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {program.description}
                      </p>
                      <div className="space-y-3 mb-6">
                        {program.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              program.color === "primary" ? "bg-primary" : "bg-accent"
                            }`} />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button variant="cta" size="lg" className="w-fit" asChild>
                        <Link to="/contact">Get Involved</Link>
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <Card className="border-0 shadow-soft bg-gradient-to-br from-primary/10 to-accent/10 max-w-4xl mx-auto">
              <CardContent className="p-12 text-center space-y-6">
                <h2 className="text-4xl font-bold">Ready to Make a Difference?</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Your support helps us continue these vital programs and reach more people in need.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button variant="cta" size="lg" asChild>
                    <Link to="/donate">Donate Now</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/membership">Become a Member</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Programs;
