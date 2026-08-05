import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Home,
  ArrowLeft,
  Search,
  Heart,
  BookOpen,
  Mail,
  Users,
  Calendar,
  TrendingUp,
  Info,
  HandHeart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SEOHead from "@/components/SEOHead";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/blog?search=${encodeURIComponent(q)}` : "/blog");
  };

  const popular = [
    { path: "/", label: "Home", icon: Home, description: "Return to the homepage" },
    { path: "/about", label: "About Us", icon: Info, description: "Who we are" },
    { path: "/programs", label: "Programs", icon: Calendar, description: "What we run" },
    { path: "/impact", label: "Impact", icon: TrendingUp, description: "Our results and event highlights" },
    { path: "/blog", label: "Blog", icon: BookOpen, description: "Latest stories and news" },
    { path: "/donate", label: "Donate", icon: Heart, description: "Support our work" },
    { path: "/membership", label: "Join Us", icon: Users, description: "Become a member" },
    { path: "/volunteer", label: "Volunteer", icon: HandHeart, description: "Give your time" },
    { path: "/contact", label: "Contact", icon: Mail, description: "Get in touch" },
  ];

  return (
    <>
      <SEOHead
        title="Page Not Found"
        description="The page you're looking for doesn't exist. Search our stories or jump to Regamos Foundation's main sections."
      />
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16">
        <main className="text-center max-w-3xl mx-auto w-full" role="main" aria-labelledby="error-heading">
          <div className="relative mb-8">
            <h1
              id="error-heading"
              className="text-[120px] md:text-[180px] font-bold text-primary/10 select-none leading-none"
              aria-hidden="true"
            >
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-16 h-16 md:w-24 md:h-24 text-primary animate-pulse" aria-hidden="true" />
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Oops! We couldn&apos;t find that page
          </h2>

          <p className="text-muted-foreground mb-8 text-lg">
            The page you&apos;re looking for doesn&apos;t exist or has moved. Search our stories below, or pick
            one of the popular sections.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="mx-auto mb-8 flex w-full max-w-xl gap-2" role="search">
            <label htmlFor="notfound-search" className="sr-only">
              Search the site
            </label>
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="notfound-search"
                className="pl-9"
                placeholder="Search stories, programs, events…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          {/* Primary actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="gap-2">
              <Link to="/">
                <Home className="w-4 h-4" aria-hidden="true" />
                Go to Homepage
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="gap-2" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Go Back
            </Button>
          </div>

          {/* Popular sections */}
          <nav aria-label="Popular sections">
            <h3 className="text-lg font-semibold text-foreground mb-6">Popular sections</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
              {popular.map(({ path, label, icon: Icon, description }) => (
                <Link
                  key={path}
                  to={path}
                  className="flex flex-col items-center p-4 rounded-xl bg-card border border-border hover:border-primary hover:shadow-soft transition-smooth group text-center"
                  aria-label={`${label}: ${description}`}
                >
                  <Icon
                    className="w-7 h-7 mb-2 text-muted-foreground group-hover:text-primary transition-smooth"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-smooth">
                    {label}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">{description}</span>
                </Link>
              ))}
            </div>
          </nav>

          <p className="mt-12 text-sm text-muted-foreground">
            Still stuck?{" "}
            <Link
              to="/contact"
              className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              Contact our team
            </Link>
          </p>
        </main>
      </div>
    </>
  );
};

export default NotFound;
