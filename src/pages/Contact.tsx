import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import FAQSchema from "@/components/schemas/FAQSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Heart, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const contactFaqs = [
  {
    question: "How can I donate to Regamos Foundation?",
    answer: "You can donate through our website using card payment or bank transfer to our Zenith Bank account (1017935691). Visit our Donate page for more options."
  },
  {
    question: "How can I become a volunteer?",
    answer: "Visit our Volunteer page and fill out the application form. We welcome volunteers with various skills and availability. We'll contact you after reviewing your application."
  },
  {
    question: "What programs does Regamos Foundation offer?",
    answer: "We offer programs for widow empowerment, orphan care, youth development, education support, community development, and skills training across Nigeria."
  },
  {
    question: "How can I partner with Regamos Foundation?",
    answer: "Organizations interested in partnerships can visit our Partner page or contact us directly at regamosfoundation@gmail.com. We welcome corporate sponsors, NGOs, and government agencies."
  },
  {
    question: "Is my donation tax-deductible?",
    answer: "Regamos Foundation is a registered non-profit organization in Nigeria. We provide donation receipts upon request that may be used for tax purposes depending on your jurisdiction."
  }
];

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      content: "Lagos, Nigeria",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "0802 330 0639 / 0907 666 4049",
    },
    {
      icon: Mail,
      title: "Email Us",
      content: "regamosfoundation@gmail.com",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          message: `${formData.subject}\n\n${formData.message}`,
        }]);

      if (error) throw error;

      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead 
        title="Contact Us"
        description="Get in touch with Regamos Foundation. Contact us to learn more about our programs, volunteer opportunities, or partnership possibilities."
        url="https://regamosfoundation.lovable.app/contact"
      />
      <FAQSchema faqs={contactFaqs} />
      <div className="min-h-screen">
        <Navigation />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold">
                Get in <span className="text-primary">Touch</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                We'd love to hear from you. Reach out to learn more, volunteer, or partner with us.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div className="animate-fade-in-up">
                <Card className="border-0 shadow-soft">
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="firstName" className="text-sm font-medium">
                            First Name
                          </label>
                          <Input 
                            id="firstName" 
                            placeholder="John" 
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="lastName" className="text-sm font-medium">
                            Last Name
                          </label>
                          <Input 
                            id="lastName" 
                            placeholder="Doe" 
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            required 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
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
                        <label htmlFor="subject" className="text-sm font-medium">
                          Subject
                        </label>
                        <Input 
                          id="subject" 
                          placeholder="How can we help?" 
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          Message
                        </label>
                        <Textarea 
                          id="message" 
                          placeholder="Tell us more..." 
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
                            Sending...
                          </>
                        ) : (
                          'Send Message'
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info & CTAs */}
              <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                {/* Contact Info Cards */}
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <Card key={index} className="border-0 shadow-soft hover:shadow-glow transition-smooth">
                      <CardContent className="p-6 flex items-start gap-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 shrink-0">
                          <info.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{info.title}</h3>
                          <p className="text-muted-foreground">{info.content}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Get Involved CTAs */}
                <Card className="border-0 shadow-soft bg-gradient-to-br from-primary/5 to-accent/5">
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-3">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
                        <Heart className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold">Volunteer With Us</h3>
                      <p className="text-muted-foreground">
                        Join our community of dedicated volunteers making a real difference in people's lives.
                      </p>
                      <Button variant="cta" className="w-full" asChild>
                        <Link to="/volunteer">Learn More</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-soft bg-gradient-to-br from-accent/5 to-primary/5">
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-3">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10">
                        <Users className="h-7 w-7 text-accent" />
                      </div>
                      <h3 className="text-2xl font-bold">Partner With Us</h3>
                      <p className="text-muted-foreground">
                        Collaborate with us to create sustainable impact and empower communities together.
                      </p>
                      <Button variant="cta" className="w-full" asChild>
                        <Link to="/partner">Get Started</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
    </>
  );
};

export default Contact;