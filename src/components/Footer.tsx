import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";

const Footer = () => {
  const quickLinks = [
    { name: "About Us", path: "/about" },
    { name: "Programs", path: "/programs" },
    { name: "Impact Stories", path: "/impact" },
    { name: "Blog", path: "/blog" },
  ];

  const supportLinks = [
    { name: "Donate", path: "/donate" },
    { name: "Become a Member", path: "/membership" },
    { name: "Volunteer", path: "/contact" },
    { name: "Partner With Us", path: "/contact" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div className="space-y-6">
            <img src={logo} alt="Regamos Foundation" className="h-16 w-auto brightness-0 invert" />
            <p className="text-sm leading-relaxed opacity-90">
              Empowering widows, orphans, abused girls, and youth through education, empowerment, and community development.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-smooth"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-smooth"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-smooth"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
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
                <li key={link.path}>
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
                  <span>+234 XXX XXX XXXX</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 shrink-0" />
                  <span>info@regamosfoundation.org</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                />
                <Button variant="secondary" size="sm">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground/20 text-center text-sm opacity-90">
          <p>&copy; {new Date().getFullYear()} Regamos Foundation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
