import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TeamSection from "@/components/TeamSection";
import SEOHead from "@/components/SEOHead";
import FAQSchema from "@/components/schemas/FAQSchema";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, Target, Award } from "lucide-react";

const About = () => {
  const coreValues = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We approach every individual with empathy, understanding, and unconditional care.",
    },
    {
      icon: Target,
      title: "Integrity",
      description: "Transparency and honesty guide all our operations and interactions with stakeholders.",
    },
    {
      icon: Users,
      title: "Empowerment",
      description: "We believe in enabling people to take control of their own lives and futures.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for the highest standards in all our programs and community initiatives.",
    },
  ];

  const aboutFaqs = [
    {
      question: "What is Regamos Foundation?",
      answer: "Regamos Foundation is a private, voluntary, faith-based NGO founded in 2018 and incorporated in 2020. We are dedicated to empowering widows, orphans, abused girls, and youth through education, skill development, psychological support, and community engagement in Nigeria."
    },
    {
      question: "When was Regamos Foundation established?",
      answer: "Regamos Foundation was founded in 2018 and officially incorporated in 2020. Since then, we have touched the lives of hundreds of widows and thousands of young people across multiple communities in Nigeria."
    },
    {
      question: "What are Regamos Foundation's core values?",
      answer: "Our core values are Compassion (approaching every individual with empathy and care), Integrity (transparency and honesty in all operations), Empowerment (enabling people to take control of their lives), and Excellence (striving for the highest standards in all programs)."
    },
    {
      question: "Who does Regamos Foundation help?",
      answer: "We primarily help widows, orphans, abused girls, and youth. Our programs provide education, vocational training, psychological support, shelter services, and community development initiatives to these vulnerable groups."
    },
    {
      question: "Is Regamos Foundation a registered organization?",
      answer: "Yes, Regamos Foundation is an officially incorporated and registered NGO in Nigeria. We operate with full transparency and provide regular financial reports to stakeholders."
    }
  ];

  return (
    <>
      <SEOHead 
        title="About Us"
        description="Learn about Regamos Foundation's mission to empower widows, orphans, abused girls, and youth through education and community development in Nigeria."
        url="https://regamosfoundation.lovable.app/about"
      />
      <FAQSchema faqs={aboutFaqs} />
      <div className="min-h-screen">
        <Navigation />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold">
                About <span className="text-primary">Regamos Foundation</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                A faith-based organization committed to transforming lives through education, empowerment, and advocacy
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12 animate-fade-in-up">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-primary">Our Story</h2>
                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Regamos Foundation was born out of a deep desire to make a meaningful difference in the lives of 
                    the most vulnerable members of our society. Founded in 2018 and officially incorporated in 2020, 
                    we are a private, voluntary, faith-based NGO dedicated to empowering widows, orphans, abused girls, 
                    and youth.
                  </p>
                  <p>
                    Our journey began with a simple yet powerful vision: to create a world where every person, 
                    regardless of their circumstances, has access to the resources, support, and opportunities they 
                    need to thrive. Through education, skill development, psychological support, and community 
                    engagement, we work tirelessly to turn this vision into reality.
                  </p>
                  <p>
                    Today, we have touched the lives of hundreds of widows and thousands of young people across 
                    multiple communities, providing them with the tools and confidence to build better futures for 
                    themselves and their families.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Core Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {coreValues.map((value, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-soft hover:shadow-glow transition-smooth animate-fade-in-up bg-card/80 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <TeamSection />
      </main>
      <Footer />
    </div>
    </>
  );
};

export default About;
