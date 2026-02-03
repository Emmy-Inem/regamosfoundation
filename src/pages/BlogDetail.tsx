import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, MessageCircle, Link2, Linkedin, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPost();
      incrementViewCount();
    }
  }, [id]);

  const incrementViewCount = async () => {
    if (!id) return;
    try {
      await supabase.rpc('increment_view_count', { post_id: id });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast.error('Blog post not found');
        navigate('/blog');
        return;
      }

      setPost(data);
      
      // Fetch related posts in the same category
      const { data: related } = await supabase
        .from('blog_posts')
        .select('id, title, image_url, category, published_at, view_count')
        .eq('category', data.category)
        .neq('id', id)
        .order('view_count', { ascending: false })
        .limit(3);
      
      setRelatedPosts(related || []);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      toast.error('Failed to load blog post');
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(post?.title || '');
  const encodedExcerpt = encodeURIComponent(post?.excerpt?.replace(/<[^>]*>/g, '') || '');

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedExcerpt}`,
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success('Link copied to clipboard!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt?.replace(/<[^>]*>/g, ''),
        url: currentUrl,
      });
    } else {
      handleCopyLink();
    }
  };

  // Strip HTML for meta description
  const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, '') || '';

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title={post.title}
        description={stripHtml(post.excerpt).substring(0, 160)}
        keywords={`${post.category}, regamos foundation, nigeria ngo, ${post.title.toLowerCase()}`}
        image={post.image_url || undefined}
        url={currentUrl}
        type="article"
        author={post.author || 'Regamos Foundation'}
      />
      <Navigation />
      <main className="flex-1 py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button
            variant="ghost"
            className="mb-4 sm:mb-6 text-sm"
            onClick={() => navigate('/blog')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>

          <article className="space-y-6 sm:space-y-8">
            {/* Featured Image */}
            {post.image_url && (
              <div className="relative h-48 sm:h-64 md:h-96 rounded-lg overflow-hidden">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              </div>
            )}

            {/* Header */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 bg-accent text-white text-xs sm:text-sm font-semibold rounded-full">
                  {post.category}
                </span>
                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>
                      {new Date(post.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <User className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{post.author || 'Regamos Foundation'}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{post.view_count || 0} reads</span>
                  </div>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                {post.title}
              </h1>

              <div 
                className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed prose prose-sm sm:prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.excerpt }}
              />

              {/* Social Sharing Buttons */}
              <div className="flex flex-wrap gap-2 pt-3 sm:pt-4">
                <span className="text-xs sm:text-sm text-muted-foreground self-center mr-1 sm:mr-2">Share:</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white border-0 text-xs sm:text-sm px-2 sm:px-3"
                  onClick={() => window.open(shareLinks.facebook, '_blank', 'width=600,height=400')}
                >
                  <Facebook className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Facebook</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white border-0 text-xs sm:text-sm px-2 sm:px-3"
                  onClick={() => window.open(shareLinks.twitter, '_blank', 'width=600,height=400')}
                >
                  <Twitter className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Twitter</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-[#25D366] hover:bg-[#25D366]/90 text-white border-0 text-xs sm:text-sm px-2 sm:px-3"
                  onClick={() => window.open(shareLinks.whatsapp, '_blank')}
                >
                  <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white border-0 text-xs sm:text-sm px-2 sm:px-3"
                  onClick={() => window.open(shareLinks.linkedin, '_blank', 'width=600,height=400')}
                >
                  <Linkedin className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">LinkedIn</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm px-2 sm:px-3"
                  onClick={handleCopyLink}
                >
                  <Link2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Copy Link</span>
                </Button>
              </div>
            </div>

            {/* Content */}
            <Card className="border-0 shadow-soft">
              <CardContent className="p-4 sm:p-6 md:p-8 lg:p-12">
                <div 
                  className="prose prose-sm sm:prose-base md:prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </CardContent>
            </Card>

            {/* Related Posts Section */}
            {relatedPosts.length > 0 && (
              <div className="mt-8 sm:mt-12">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Related Articles</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedPosts.map((relatedPost) => (
                    <Card 
                      key={relatedPost.id}
                      className="group overflow-hidden border-0 shadow-soft hover:shadow-glow transition-smooth cursor-pointer"
                      onClick={() => navigate(`/blog/${relatedPost.id}`)}
                    >
                      <div className="relative h-32 overflow-hidden">
                        {relatedPost.image_url ? (
                          <img
                            src={relatedPost.image_url}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <span className="inline-block px-2 py-0.5 bg-accent text-white text-[10px] font-semibold rounded-full mb-1">
                            {relatedPost.category}
                          </span>
                          <h3 className="text-sm font-semibold text-white line-clamp-2">{relatedPost.title}</h3>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(relatedPost.published_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{relatedPost.view_count || 0} reads</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetail;
