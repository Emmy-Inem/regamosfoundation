import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Handshake, Target, TrendingUp, Globe, Heart, Cpu, GraduationCap, Stethoscope, Scale, Building } from "lucide-react";
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

  const partnershipOpportunities = [
    {
      icon: Stethoscope,
      title: "Healthcare Services",
      description: "Partner with us to provide free healthcare services to widows, orphans and abused girls.",
      services: [
        "Assistance in promoting healthier lifestyles",
        "Supply/donation of medications and health care products",
        "Corporate partnership with healthcare institutions for free treatments",
        "Free eye health services"
      ]
    },
    {
      icon: Cpu,
      title: "Technology",
      description: "Information technology capacity building for widows, their children, orphans and vulnerable youth.",
      services: [
        "Donation of learning aids such as computers and gadgets",
        "Support for education of widows' children and orphans",
        "Mobile technology initiatives"
      ]
    },
    {
      icon: GraduationCap,
      title: "Human Capital Development",
      description: "Training and skill development for economic empowerment.",
      services: [
        "Enterprise development training",
        "Skills acquisition and vocational training",
        "Agribusiness (farming, fishery, piggery, poultry)",
        "Donation of machinery/equipment e.g., sewing machines",
        "Donation of farmlands and tools for success"
      ]
    },
    {
      icon: Scale,
      title: "Legal Support",
      description: "Partner to provide legal services for widows and orphans.",
      services: [
        "Free legal consultations",
        "Help accessing late spouse's assets",
        "Claims to gratuity assistance",
        "Advocacy and legal rights education"
      ]
    },
  ];

  const commitments = [
    "Keep you updated on the development of projects and use of donations",
    "Treat your information and donations with respect and confidentiality",
    "Ensure proper appreciation for your support",
    "Provide regular impact reports and transparency"
  ];

  return (
    <>
      <SEOHead 
        title="Partner With Us"
        description="Collaborate with Regamos Foundation to create sustainable impact. Partner through healthcare, technology, human capital development, and more."
        url="https://regamosfoundation.lovable.app/partner"
      />
      <div className="min-h-screen">
        <Navigation />
        <main>
          {/* Hero Section */}
          <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-14 md:pb-16 bg-gradient-to-b from-muted/30 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 animate-fade-in">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                  Partner <span className="text-primary">With Us</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed px-2">
                  We offer platforms for our partners to collaborate with us in solving the issues that affect widows and orphans through the provision of free services.
                </p>
              </div>
            </div>
          </section>

          {/* Partnership Types Section */}
          <section className="py-12 sm:py-14 md:py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 sm:mb-10 md:mb-12">Partnership Types</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                  {partnershipTypes.map((type, index) => (
                    <Card key={index} className="border-0 shadow-soft hover:shadow-glow transition-smooth">
                      <CardContent className="p-4 sm:p-5 md:p-6 text-center space-y-3 sm:space-y-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary/10 mx-auto">
                          <type.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
                        </div>
                        <h3 className="font-semibold text-base sm:text-lg">{type.title}</h3>
                        <p className="text-muted-foreground text-xs sm:text-sm">{type.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Partnership Opportunities Section */}
          <section className="py-16 sm:py-20 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Partnership Opportunities</h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto px-2">
                  Areas where your organization can make a meaningful impact
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
                {partnershipOpportunities.map((opportunity, index) => (
                  <Card
                    key={index}
                    className="border-0 shadow-soft hover:shadow-glow transition-smooth animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6 sm:p-8 space-y-4">
                      <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10">
                        <opportunity.icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">{opportunity.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">{opportunity.description}</p>
                      <ul className="space-y-2">
                        {opportunity.services.map((service, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            {service}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Our Commitment Section */}
          <section className="py-16 sm:py-20 md:py-24 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <Card className="border-0 shadow-soft bg-gradient-to-br from-primary/5 to-accent/5">
                  <CardContent className="p-6 sm:p-8 md:p-10">
                    <div className="text-center mb-6 sm:mb-8">
                      <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-4">
                        <Heart className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                      </div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Our Commitment to Partners</h2>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        As a supporter/partner of REGAMOS Foundation, you have a right to know how your support will be used.
                      </p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                      {commitments.map((commitment, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Building className="h-3 w-3 text-primary" />
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">{commitment}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Partnership Form Section */}
          <section className="py-16 sm:py-20 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <Card className="border-0 shadow-soft">
                  <CardContent className="p-5 sm:p-6 md:p-8">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center">Start a Partnership</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
                          placeholder="e.g., Healthcare, Technology, Human Capital" 
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