import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Handshake, Target, TrendingUp, Globe } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const Partner = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: "",
    contactName: "",
    email: "",
    phone: "",
    partnershipType: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: `${formData.organizationName} (${formData.contactName})`,
          email: formData.email,
          phone: formData.phone,
          message: `Partnership Type: ${formData.partnershipType}\n\n${formData.message}`,
        }]);

      if (error) throw error;

      toast.success("Partnership inquiry submitted! We'll contact you soon.");
      setFormData({
        organizationName: "",
        contactName: "",
        email: "",
        phone: "",
        partnershipType: "",
        message: "",
      });
    } catch (error) {
      console.error('Error submitting partnership form:', error);
      toast.error("Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const partnershipTypes = [
    {
      icon: Handshake,
      title: "Corporate Partnership",
      description: "Collaborate with us through CSR initiatives and employee engagement programs.",
    },
    {
      icon: Target,
      title: "Program Sponsorship",
      description: "Fund specific programs or events that align with your organization's values.",
    },
    {
      icon: TrendingUp,
      title: "Capacity Building",
      description: "Share expertise and resources to strengthen our organizational capabilities.",
    },
    {
      icon: Globe,
      title: "Strategic Alliance",
      description: "Form long-term partnerships to maximize community impact together.",
    },
  ];

  return (
    <>
      <SEOHead 
        title="Partner With Us"
        description="Collaborate with Regamos Foundation to create sustainable impact and empower communities. Explore partnership opportunities."
        url="https://regamosfoundation.lovable.app/partner"
      />
      <div className="min-h-screen">
        <Navigation />
        <main>
          {/* Hero Section */}
          <section className="pt-32 pb-16 bg-gradient-to-b from-muted/30 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
                <h1 className="text-5xl md:text-6xl font-bold">
                  Partner <span className="text-primary">With Us</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Collaborate with us to create sustainable impact and empower communities together.
                </p>
              </div>
            </div>
          </section>

          {/* Partnership Types Section */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">Partnership Opportunities</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {partnershipTypes.map((type, index) => (
                    <Card key={index} className="border-0 shadow-soft hover:shadow-glow transition-smooth">
                      <CardContent className="p-6 text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto">
                          <type.icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg">{type.title}</h3>
                        <p className="text-muted-foreground text-sm">{type.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Partnership Form Section */}
          <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <Card className="border-0 shadow-soft">
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold mb-6 text-center">Start a Partnership</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="organizationName" className="text-sm font-medium">
                          Organization Name *
                        </label>
                        <Input 
                          id="organizationName" 
                          placeholder="Your Company/Organization" 
                          value={formData.organizationName}
                          onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="contactName" className="text-sm font-medium">
                          Contact Person *
                        </label>
                        <Input 
                          id="contactName" 
                          placeholder="John Doe" 
                          value={formData.contactName}
                          onChange={(e) => setFormData({...formData, contactName: e.target.value})}
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
                          placeholder="contact@company.com" 
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
                        <label htmlFor="partnershipType" className="text-sm font-medium">
                          Partnership Interest *
                        </label>
                        <Input 
                          id="partnershipType" 
                          placeholder="e.g., Corporate Partnership, Program Sponsorship" 
                          value={formData.partnershipType}
                          onChange={(e) => setFormData({...formData, partnershipType: e.target.value})}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          Tell us about your partnership goals *
                        </label>
                        <Textarea 
                          id="message" 
                          placeholder="Share your vision for our collaboration..." 
                          rows={6} 
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
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
                          'Submit Partnership Inquiry'
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

export default Partner;
