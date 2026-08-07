import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User, ArrowLeft, ArrowRight, Facebook, Twitter, MessageCircle, Link2, Linkedin, Eye, Clock, ArrowUp, ListTree } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, '') || '';


/** Estimated reading time in minutes (225 wpm) */
const readingTime = (html: string) => {
  const words = stripHtml(html).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 225));
};


/** Remove the cover image from post body to avoid duplication */
const processContent = (html: string, coverUrl?: string | null): string => {
  if (!html) return '';

  let processed = html;

  // Make all links open in new tab
  processed = processed.replace(/<a\s/g, '<a target="_blank" rel="noopener noreferrer" ');

  // Remove images matching the cover URL
  if (coverUrl) {
    // Normalize URL for comparison — strip protocol and query params
    const normalize = (url: string) => url.replace(/^https?:\/\//, '').split('?')[0];
    const normalizedCover = normalize(coverUrl);

    // Remove all <img> tags whose src matches the cover image
    processed = processed.replace(/<img[^>]*src=["']([^"']*)["'][^>]*\/?>/gi, (match, src) => {
      return normalize(src) === normalizedCover ? '' : match;
    });
  }

  // Remove the very first <img> if it appears before any real text content
  // (handles cases where cover was re-uploaded with different URL)
  const stripped = processed.replace(/^(\s*(<p>\s*)*)/i, '');
  if (stripped.startsWith('<img')) {
    processed = processed.replace(/<img[^>]*\/?>/, '');
  }

  // Clean up empty paragraphs
  processed = processed.replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/g, '');

  return processed;
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);

/** Add anchor ids to h2/h3 headings and return the table of contents */
const buildToc = (html: string) => {
  const headings: { id: string; text: string; level: number }[] = [];
  const used = new Set<string>();

  const withIds = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_match, level: string, attrs: string, inner: string) => {
      const text = stripHtml(inner).trim();
      if (!text) return _match;
      let id = slugify(text) || `section-${headings.length + 1}`;
      let n = 2;
      while (used.has(id)) id = `${id}-${n++}`;
      used.add(id);
      headings.push({ id, text, level: Number(level) });
      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
    }
  );

  return { html: withIds, headings };
};

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [siblings, setSiblings] = useState<{ prev: any | null; next: any | null }>({ prev: null, next: null });
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);


  useEffect(() => {
    if (id) {
      fetchPost();
      incrementViewCount();
    }
  }, [id]);

  // Reading progress indicator
  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


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
      
      const { data: related } = await supabase
        .from('blog_posts')
        .select('id, title, image_url, category, published_at, view_count')
        .eq('category', data.category)
        .neq('id', id)
        .order('view_count', { ascending: false })
        .limit(3);
      
      setRelatedPosts(related || []);

      // Previous / next post by publish date
      const anchor = data.published_at || data.created_at;
      const [{ data: prev }, { data: next }] = await Promise.all([
        supabase
          .from('blog_posts')
          .select('id, title, image_url')
          .lt('published_at', anchor)
          .order('published_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('blog_posts')
          .select('id, title, image_url')
          .gt('published_at', anchor)
          .order('published_at', { ascending: true })
          .limit(1)
          .maybeSingle(),
      ]);
      setSiblings({ prev: prev || null, next: next || null });

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
  const encodedExcerpt = encodeURIComponent(stripHtml(post?.excerpt || ''));

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

  const { html: contentHtml, headings } = useMemo(
    () => buildToc(processContent(post?.content || '', post?.image_url)),
    [post?.content, post?.image_url]
  );

  const articleSchema = useMemo(() => {
    if (!post) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: stripHtml(post.excerpt || '').substring(0, 200),
      image: post.image_url ? [post.image_url] : undefined,
      datePublished: post.published_at || post.created_at,
      dateModified: post.updated_at || post.published_at || post.created_at,
      articleSection: post.category,
      author: { '@type': 'Organization', name: post.author || 'Regamos Foundation' },
      publisher: {
        '@type': 'Organization',
        name: 'Regamos Foundation',
        url: 'https://www.regamosfoundation.com.ng',
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': currentUrl },
      wordCount: stripHtml(post.content || '').trim().split(/\s+/).filter(Boolean).length,
    };
  }, [post, currentUrl]);

  const scrollToHeading = (headingId: string) => {
    document.getElementById(headingId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };


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

  if (!post) return null;

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
      {/* Reading progress */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
        <div
          className="h-full bg-accent transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
      <main className="flex-1 py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <Button
            variant="ghost"
            className="mb-4 sm:mb-6 text-sm"
            onClick={() => navigate('/blog')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>

          <article className="space-y-8 sm:space-y-10">
            {/* Header */}
            <header className="space-y-4 sm:space-y-5">
              <span className="inline-block px-3 py-1 bg-accent text-white text-xs sm:text-sm font-semibold rounded-full">
                {post.category}
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-balance">
                {post.title}
              </h1>

              {/* Excerpt as standfirst */}
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                {stripHtml(post.excerpt)}
              </p>

              <div className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm text-muted-foreground flex-wrap border-y border-border py-3">
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <span className="font-medium text-foreground">{post.author || 'Regamos Foundation'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Date not available'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime(post.content)} min read</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  <span>{post.view_count || 0} reads</span>
                </div>
              </div>

              {/* Featured Image — full, uncropped, after title */}
              {post.image_url && (
                <figure className="space-y-2">
                  <div className="rounded-xl overflow-hidden bg-muted shadow-soft">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <figcaption className="text-xs sm:text-sm text-muted-foreground italic text-center">
                    {post.title}
                  </figcaption>
                </figure>
              )}


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
            </header>


            {/* Table of contents */}
            {headings.length >= 3 && (
              <nav
                aria-label="Table of contents"
                className="rounded-xl border border-border bg-muted/40 p-5 sm:p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <ListTree className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold uppercase tracking-wide">In this article</span>
                </div>
                <ol className="space-y-1.5">
                  {headings.map((h, i) => (
                    <li key={h.id} className={h.level === 3 ? 'pl-5' : ''}>
                      <button
                        type="button"
                        onClick={() => scrollToHeading(h.id)}
                        className="text-left text-sm text-muted-foreground hover:text-primary transition-smooth"
                      >
                        <span className="text-primary font-semibold mr-2">{i + 1}.</span>
                        {h.text}
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {/* Content */}
            <div
              className="blog-content max-w-none"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />


            {/* Closing CTA */}
            <div className="rounded-xl border border-border bg-muted/40 p-6 sm:p-8 text-center space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold">Support this work</h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
                Every story here is made possible by people who give, volunteer and partner with Regamos Foundation.
              </p>
              <div className="flex flex-wrap gap-3 justify-center pt-1">
                <Button variant="cta" onClick={() => navigate('/donate')}>Donate</Button>
                <Button variant="outline" onClick={() => navigate('/volunteer')}>Volunteer</Button>
              </div>
            </div>


            {/* Related Posts Section */}
            {relatedPosts.length > 0 && (
              <div className="mt-8 sm:mt-12">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Related Articles</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedPosts.map((relatedPost) => (
                    <Card 
                      key={relatedPost.id}
                      className="group overflow-hidden border-0 shadow-soft hover:shadow-glow transition-smooth cursor-pointer flex flex-col"
                      onClick={() => navigate(`/blog/${relatedPost.id}`)}
                    >
                      <div className="relative h-32 overflow-hidden shrink-0">
                        {relatedPost.image_url ? (
                          <img
                            src={relatedPost.image_url}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
                        )}
                      </div>
                      <CardContent className="p-3 flex flex-col flex-1 gap-2">
                        <span className="inline-block px-2 py-0.5 bg-accent text-white text-[10px] font-semibold rounded-full w-fit">
                          {relatedPost.category}
                        </span>
                        <h3 className="text-sm font-semibold text-foreground line-clamp-2">{relatedPost.title}</h3>
                        <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {relatedPost.published_at 
                                ? new Date(relatedPost.published_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })
                                : 'N/A'}
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
