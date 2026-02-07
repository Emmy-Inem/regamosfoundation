import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, ArrowRight, Search, X, Eye, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useBlogSearch } from "@/hooks/useBlogSearch";
import educationImg from "@/assets/education.jpg";
import empowermentImg from "@/assets/empowerment.jpg";
import communityImg from "@/assets/community.jpg";

const Blog = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visiblePosts, setVisiblePosts] = useState(6);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const categories = ["All", "Empowerment", "Education", "Community", "Youth Development", "Mental Health"];

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

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
  ];

  const displayPosts = blogPosts.length > 0 ? blogPosts : defaultPosts;
  const { searchQuery, setSearchQuery, searchResults, clearSearch, resultCount } = useBlogSearch(displayPosts);

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams, setSearchQuery]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

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

  const filteredPosts = selectedCategory === "All" 
    ? searchResults 
    : searchResults.filter(post => post.category === selectedCategory);

  const featuredPosts = [...blogPosts]
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    .slice(0, 3);

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
    <>
      <SEOHead 
        title="Blog"
        description="Read inspiring stories, updates, and insights from Regamos Foundation's journey of empowering communities and transforming lives."
        url="https://regamosfoundation.lovable.app/blog"
      />
      <div className="min-h-screen">
        <Navigation />
        <main>
          {/* Hero Section */}
          <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-14 md:pb-16 bg-gradient-to-b from-muted/30 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 animate-fade-in">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                  Our <span className="text-primary">Blog</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed px-2">
                  Stories, updates, and insights from our journey of empowerment
                </p>
                
                {/* Search Bar */}
                <div className="max-w-md mx-auto pt-4 px-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-9 sm:pl-10 pr-10 text-sm sm:text-base"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => handleSearchChange('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    )}
                  </div>
                  {searchQuery && (
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                      Found {resultCount} article{resultCount !== 1 ? 's' : ''} matching "{searchQuery}"
                    </p>
                  )}
                </div>

                {/* External Blog Link */}
                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gap-2"
                    onClick={() => window.open('https://regamosfoundation.business.blog/blog/', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Our WordPress Blog
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Posts Section */}
          {!loading && blogPosts.length > 0 && (
            <section className="py-8 sm:py-12 bg-muted/20">
              <div className="container mx-auto px-4">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">Featured Articles</h2>
                  <p className="text-muted-foreground">Most popular stories from our foundation</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
                  {featuredPosts.map((post) => (
                    <Card 
                      key={post.id}
                      className="group overflow-hidden border-0 shadow-soft hover:shadow-glow transition-smooth cursor-pointer"
                      onClick={() => navigate(`/blog/${post.id}`)}
                    >
                      <div className="relative h-32 sm:h-40 overflow-hidden">
                        {post.image_url ? (
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <span className="inline-block px-2 py-0.5 bg-accent text-white text-[10px] sm:text-xs font-semibold rounded-full mb-1">
                            {post.category}
                          </span>
                          <h3 className="text-sm sm:text-base font-semibold text-white line-clamp-2">{post.title}</h3>
                        </div>
                      </div>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(post.published_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{post.view_count || 0} reads</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )}

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
          <section className="py-12 sm:py-16 md:py-24 bg-background">
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
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
                    {filteredPosts.slice(0, visiblePosts).map((post, index) => (
                      <Card
                        key={post.id || index}
                        className="group overflow-hidden border-0 shadow-soft hover:shadow-glow transition-smooth animate-fade-in-up cursor-pointer"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden">
                          {post.image_url || post.image ? (
                            <img
                              src={post.image_url || post.image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                              <p className="text-muted-foreground text-sm">No image</p>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                            <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 bg-accent text-white text-[10px] sm:text-xs font-semibold rounded-full">
                              {post.category}
                            </span>
                          </div>
                        </div>
                        <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
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
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span>{post.view_count || 0} reads</span>
                            </div>
                          </div>
                          <h3 className="text-base sm:text-lg md:text-xl font-semibold leading-tight group-hover:text-primary transition-smooth line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-3">
                            {stripHtml(post.excerpt)}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                              <User className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="truncate max-w-[100px] sm:max-w-none">{post.author || 'Regamos Foundation'}</span>
                            </div>
                            <Button 
                              variant="link" 
                              className="p-0 h-auto group text-sm"
                              onClick={() => post.id && navigate(`/blog/${post.id}`)}
                            >
                              Read More
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

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

          {/* Founder's Blog Section */}
          <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <Card className="border-0 shadow-soft bg-gradient-to-br from-accent/10 to-primary/10 max-w-3xl mx-auto overflow-hidden">
                <CardContent className="p-6 sm:p-8 md:p-12 text-center space-y-4 sm:space-y-6">
                  <div className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-xs sm:text-sm font-medium">
                    From Our Founder
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Read More From Dr. Regina Inem</h2>
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                    Explore inspiring thoughts, insights, and stories from our founder's personal blog
                  </p>
                  <Button 
                    variant="cta" 
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={() => window.open('https://regina-inem.com.ng/', '_blank')}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Visit Founder's Blog
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Newsletter CTA */}
          <section className="py-12 sm:py-16 md:py-20 bg-background">
            <div className="container mx-auto px-4">
              <Card className="border-0 shadow-soft bg-gradient-to-br from-primary/10 to-accent/10 max-w-3xl mx-auto">
                <CardContent className="p-6 sm:p-8 md:p-12 text-center space-y-4 sm:space-y-6">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Stay Updated</h2>
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
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
                    <Button type="submit" variant="cta" size="lg" className="w-full sm:w-auto">
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
    </>
  );
};

export default Blog;