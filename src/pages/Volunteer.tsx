import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Calendar, Award } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const Volunteer = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    skills: "",
    motivation: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('members')
        .insert([{
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          skills: formData.skills,
          motivation: formData.motivation,
          membership_type: 'volunteer',
        }]);

      if (error) throw error;

      toast.success("Application submitted successfully! We'll get back to you soon.");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        skills: "",
        motivation: "",
      });
    } catch (error) {
      console.error('Error submitting volunteer form:', error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: Heart,
      title: "Make a Difference",
      description: "Directly impact lives and contribute to meaningful community development.",
    },
    {
      icon: Users,
      title: "Build Connections",
      description: "Network with like-minded individuals and grow your professional circle.",
    },
    {
      icon: Calendar,
      title: "Flexible Commitment",
      description: "Choose volunteering opportunities that fit your schedule and interests.",
    },
    {
      icon: Award,
      title: "Gain Experience",
      description: "Develop new skills and enhance your resume with volunteer experience.",
    },
  ];

  return (
    <>
      <SEOHead 
        title="Volunteer With Us"
        description="Join Regamos Foundation as a volunteer and make a real difference in people's lives. Apply now to be part of our community impact initiatives."
        url="https://regamosfoundation.lovable.app/volunteer"
      />
      <div className="min-h-screen">
        <Navigation />
        <main>
          {/* Hero Section */}
          <section className="pt-32 pb-16 bg-gradient-to-b from-muted/30 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
                <h1 className="text-5xl md:text-6xl font-bold">
                  Volunteer <span className="text-primary">With Us</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Join our community of dedicated volunteers making a real difference in people's lives.
                </p>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">Why Volunteer With Us?</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {benefits.map((benefit, index) => (
                    <Card key={index} className="border-0 shadow-soft hover:shadow-glow transition-smooth">
                      <CardContent className="p-6 text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto">
                          <benefit.icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg">{benefit.title}</h3>
                        <p className="text-muted-foreground text-sm">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Application Form Section */}
          <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <Card className="border-0 shadow-soft">
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold mb-6 text-center">Apply to Volunteer</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="fullName" className="text-sm font-medium">
                          Full Name *
                        </label>
                        <Input 
                          id="fullName" 
                          placeholder="John Doe" 
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email *
                        </label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="john@example.com" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">
                          Phone Number *
                        </label>
                        <Input 
                          id="phone" 
                          type="tel" 
                          placeholder="+234 800 000 0000" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="skills" className="text-sm font-medium">
                          Skills & Experience
                        </label>
                        <Textarea 
                          id="skills" 
                          placeholder="Tell us about your relevant skills and experience..." 
                          rows={4} 
                          value={formData.skills}
                          onChange={(e) => setFormData({...formData, skills: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="motivation" className="text-sm font-medium">
                          Why do you want to volunteer? *
                        </label>
                        <Textarea 
                          id="motivation" 
                          placeholder="Share your motivation for volunteering..." 
                          rows={4} 
                          value={formData.motivation}
                          onChange={(e) => setFormData({...formData, motivation: e.target.value})}
                          required 
                        />
                      </div>
                      <Button type="submit" variant="cta" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Application'
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Volunteer;
