import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Search, Heart, BookOpen, Mail, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const quickLinks = [
    { path: "/", label: "Home", icon: Home, description: "Return to homepage" },
    { path: "/programs", label: "Programs", icon: BookOpen, description: "Explore our programs" },
    { path: "/donate", label: "Donate", icon: Heart, description: "Support our cause" },
    { path: "/membership", label: "Join Us", icon: Users, description: "Become a member" },
    { path: "/contact", label: "Contact", icon: Mail, description: "Get in touch" },
  ];

  return (
    <>
      <SEOHead
        title="Page Not Found"
        description="The page you're looking for doesn't exist. Navigate back to Regamos Foundation's main sections."
      />
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <main className="text-center max-w-2xl mx-auto" role="main" aria-labelledby="error-heading">
          {/* Animated 404 */}
          <div className="relative mb-8">
            <h1 
              id="error-heading"
              className="text-[120px] md:text-[180px] font-bold text-primary/10 select-none"
              aria-hidden="true"
            >
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-16 h-16 md:w-24 md:h-24 text-primary animate-pulse" aria-hidden="true" />
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Oops! Page not found
          </h2>
          
          <p className="text-muted-foreground mb-8 text-lg">
            The page you're looking for doesn't exist or has been moved. 
            Let us help you find what you need.
          </p>

          {/* Primary action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="gap-2">
              <Link to="/">
                <Home className="w-4 h-4" aria-hidden="true" />
                Go to Homepage
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Go Back
              </Link>
            </Button>
          </div>

          {/* Quick links */}
          <nav aria-label="Quick navigation links">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {quickLinks.map(({ path, label, icon: Icon, description }) => (
                <Link
                  key={path}
                  to={path}
                  className="flex flex-col items-center p-4 rounded-xl bg-card border border-border hover:border-primary hover:shadow-soft transition-smooth group"
                  aria-label={`${label}: ${description}`}
                >
                  <Icon 
                    className="w-8 h-8 mb-2 text-muted-foreground group-hover:text-primary transition-smooth" 
                    aria-hidden="true" 
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-smooth">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Help text */}
          <p className="mt-12 text-sm text-muted-foreground">
            Need assistance?{" "}
            <Link to="/contact" className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
              Contact our support team
            </Link>
          </p>
        </main>
      </div>
    </>
  );
};

export default NotFound;
