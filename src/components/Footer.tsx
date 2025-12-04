import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const quickLinks = [
    { name: "About Us", path: "/about" },
    { name: "Programs", path: "/programs" },
    { name: "Impact Stories", path: "/impact" },
    { name: "Blog", path: "/blog" },
  ];

  const supportLinks = [
    { name: "Donate", path: "/donate", id: "donate" },
    { name: "Become a Member", path: "/membership", id: "membership" },
    { name: "Volunteer", path: "/volunteer", id: "volunteer" },
    { name: "Partner With Us", path: "/partner", id: "partner" },
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email: newsletterEmail }]);

      if (error) {
        if (error.code === '23505') {
          toast.info("You're already subscribed!");
        } else {
          throw error;
        }
      } else {
        // Send welcome email via edge function
        try {
          await supabase.functions.invoke('send-newsletter-welcome', {
            body: { email: newsletterEmail }
          });
        } catch (emailError) {
          console.error('Error sending welcome email:', emailError);
          // Don't fail the subscription if email fails
        }
        
        toast.success("Thank you for subscribing! Check your email for a welcome message.");
      }
      
      setNewsletterEmail("");
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div className="space-y-6">
            <img src={logo} alt="Regamos Foundation" className="h-20 md:h-24 w-auto brightness-0 invert" />
            <p className="text-sm leading-relaxed opacity-90">
              Empowering widows, orphans, abused girls, and youth through education, empowerment, and community development.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/share/1ABfZYGXHo/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-smooth"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/Foundation_raf?t=pB8MEVChM6llrmaC6HmCjA&s=09"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-smooth"
                aria-label="Twitter/X"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/regamosfoundation?igsh=ZngzanV2ZTAzanJl"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-smooth"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/regamosfoundation/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-smooth"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm opacity-90 hover:text-accent hover:opacity-100 transition-smooth">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Get Involved</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.id}>
                  <Link to={link.path} className="text-sm opacity-90 hover:text-accent hover:opacity-100 transition-smooth">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
              <ul className="space-y-3 text-sm opacity-90">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>Lagos, Nigeria</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 shrink-0" />
                  <span>0802 330 0639 / 0907 666 4049</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 shrink-0" />
                  <span>regamosfoundation@gmail.com</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                />
                <Button type="submit" variant="secondary" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? "..." : "Subscribe"}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground/20 text-center text-sm opacity-90 space-y-3">
          <p>&copy; {new Date().getFullYear()} Regamos Foundation. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <Link to="/privacy-policy" className="hover:text-accent transition-smooth">
              Privacy Policy
            </Link>
            <span className="opacity-50">|</span>
            <Link to="/terms-of-service" className="hover:text-accent transition-smooth">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;