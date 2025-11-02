import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import educationImg from "@/assets/education.jpg";
import empowermentImg from "@/assets/empowerment.jpg";
import communityImg from "@/assets/community.jpg";

const Blog = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visiblePosts, setVisiblePosts] = useState(6);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const categories = ["All", "Empowerment", "Education", "Community", "Youth Development", "Mental Health"];

  const defaultPosts = [
    {
      title: "Empowering Widows: A Path to Economic Independence",
      excerpt: "Discover how our widow empowerment program is helping women rebuild their lives through vocational training and microfinance opportunities.",
      image: empowermentImg,
      author: "Regamos Team",
      date: "March 15, 2024",
      category: "Empowerment",
    },
    {
      title: "The Importance of Education for Orphans",
      excerpt: "Education is a fundamental right. Learn about our scholarship programs and how they're changing the trajectory of orphaned children's lives.",
      image: educationImg,
      author: "Regamos Team",
      date: "March 10, 2024",
      category: "Education",
    },
    {
      title: "Building Sustainable Communities Together",
      excerpt: "Community development requires collaboration. See how we're working with local leaders to create lasting change in rural areas.",
      image: communityImg,
      author: "Regamos Team",
      date: "March 5, 2024",
      category: "Community",
    },
    {
      title: "Youth Skills Training: Preparing for the Future",
      excerpt: "Digital skills are essential in today's world. Our youth training programs are equipping young people with tools for success.",
      image: educationImg,
      author: "Regamos Team",
      date: "February 28, 2024",
      category: "Youth Development",
    },
    {
      title: "Supporting Survivors: Our Approach to Trauma Counseling",
      excerpt: "Mental health matters. Learn about our psychological support programs for abuse survivors and how we help them heal.",
      image: empowermentImg,
      author: "Regamos Team",
      date: "February 20, 2024",
      category: "Mental Health",
    },
    {
      title: "Celebrating 5 Years of Impact",
      excerpt: "A look back at our journey since 2018 - the challenges, victories, and the incredible people who made it all possible.",
      image: communityImg,
      author: "Regamos Team",
      date: "February 15, 2024",
      category: "Milestone",
    },
  ];

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 100) {
        setShowFilter(true);
      } else if (currentScrollY > lastScrollY) {
        setShowFilter(false);
      } else {
        setShowFilter(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayPosts = blogPosts.length > 0 ? blogPosts : defaultPosts;

  const filteredPosts = selectedCategory === "All" 
    ? displayPosts 
    : displayPosts.filter(post => post.category === selectedCategory);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        toast.success("Thank you for subscribing!");
      }
      
      setNewsletterEmail("");
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error("Failed to subscribe. Please try again.");
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold">
                Our <span className="text-primary">Blog</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Stories, updates, and insights from our journey of empowerment
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section 
          className={`py-6 md:py-8 bg-background sticky top-20 z-40 blur-glass border-b border-border transition-transform duration-300 ${
            showFilter ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "cta" : "outline"}
                  size="sm"
                  className="transition-smooth text-xs md:text-sm"
                  onClick={() => {
                    setSelectedCategory(category);
                    setVisiblePosts(6);
                  }}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading blog posts...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No blog posts found in this category.</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                  {filteredPosts.slice(0, visiblePosts).map((post, index) => (
                    <Card
                      key={post.id || index}
                      className="group overflow-hidden border-0 shadow-soft hover:shadow-glow transition-smooth animate-fade-in-up cursor-pointer"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="relative h-56 overflow-hidden">
                        {post.image_url || post.image ? (
                          <img
                            src={post.image_url || post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                            <p className="text-muted-foreground">No image</p>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span className="inline-block px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {post.published_at || post.date 
                                ? new Date(post.published_at || post.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })
                                : 'No date'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{post.author || 'Regamos Foundation'}</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold leading-tight group-hover:text-primary transition-smooth">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">{post.excerpt}</p>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto group"
                          onClick={() => post.id && navigate(`/blog/${post.id}`)}
                        >
                          Read More
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-smooth" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Load More */}
                {visiblePosts < filteredPosts.length && (
                  <div className="text-center mt-12 animate-fade-in">
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => setVisiblePosts(prev => prev + 6)}
                    >
                      Load More Posts
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <Card className="border-0 shadow-soft bg-gradient-to-br from-primary/10 to-accent/10 max-w-3xl mx-auto">
              <CardContent className="p-12 text-center space-y-6">
                <h2 className="text-4xl font-bold">Stay Updated</h2>
                <p className="text-xl text-muted-foreground">
                  Subscribe to our newsletter for the latest stories and updates from Regamos Foundation
                </p>
                <form 
                  onSubmit={handleNewsletterSubmit}
                  className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-4"
                >
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="flex-1"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" variant="cta" size="lg">
                    Subscribe
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;