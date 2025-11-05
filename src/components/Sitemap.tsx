import { Link } from "react-router-dom";
import { Home, Info, Calendar, TrendingUp, BookOpen, Heart, Users, Mail, Shield, FileText } from "lucide-react";

const Sitemap = () => {
  const links = [
    { path: "/", label: "Home", icon: Home },
    { path: "/about", label: "About Us", icon: Info },
    { path: "/programs", label: "Programs", icon: Calendar },
    { path: "/impact", label: "Impact", icon: TrendingUp },
    { path: "/blog", label: "Blog", icon: BookOpen },
    { path: "/donate", label: "Donate", icon: Heart },
    { path: "/membership", label: "Membership", icon: Users },
    { path: "/contact", label: "Contact", icon: Mail },
    { path: "/privacy-policy", label: "Privacy Policy", icon: Shield },
    { path: "/terms-of-service", label: "Terms of Service", icon: FileText },
  ];

  return (
    <section className="py-16 bg-muted" aria-labelledby="sitemap-heading">
      <div className="container mx-auto px-4">
        <h2 id="sitemap-heading" className="text-3xl font-bold text-center mb-12">Site Map</h2>
        <nav aria-label="Site navigation overview">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {links.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className="flex flex-col items-center justify-center p-6 bg-background rounded-lg shadow-soft hover:shadow-glow transition-smooth hover:scale-105 group"
                aria-label={`Navigate to ${label}`}
              >
                <Icon className="w-8 h-8 mb-3 text-primary group-hover:text-accent transition-smooth" aria-hidden="true" />
                <span className="text-sm font-medium text-center text-foreground group-hover:text-primary transition-smooth">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </section>
  );
};

export default Sitemap;
