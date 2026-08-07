import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Loader2, ArrowLeft, FileText, Image as ImageIcon, PenLine, Sparkles } from 'lucide-react';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { ImageUpload } from '@/components/ui/image-upload';
import { useActivityLog } from '@/hooks/useActivityLog';

const STRUCTURE_TEMPLATES: { name: string; description: string; html: string }[] = [
  {
    name: 'Story / Feature',
    description: 'Intro, background, the story, impact, call to action',
    html: `<p>Open with one strong paragraph that sets the scene and tells the reader why this matters.</p>
<h2>Background</h2><p>Explain the situation or the need that led to this work.</p>
<h2>What we did</h2><p>Describe the intervention step by step.</p>
<blockquote>Add a quote from a beneficiary, volunteer or partner here.</blockquote>
<h2>The impact</h2><ul><li>Key result one</li><li>Key result two</li><li>Key result three</li></ul>
<h2>How you can help</h2><p>Close with a clear next step for the reader.</p>`,
  },
  {
    name: 'Event Recap',
    description: 'What happened, highlights, photos, thanks',
    html: `<p>A short summary of the event: what, where, when and who attended.</p>
<h2>Highlights of the day</h2><ul><li>Highlight one</li><li>Highlight two</li><li>Highlight three</li></ul>
<h2>Moments in pictures</h2><p>Insert photos here using the Image button.</p>
<h2>Voices from the event</h2><blockquote>Add a participant quote here.</blockquote>
<h2>Thank you</h2><p>Acknowledge partners, sponsors and volunteers.</p>`,
  },
  {
    name: 'Announcement',
    description: 'What is new, details, who it is for, next steps',
    html: `<p>State the announcement clearly in one or two sentences.</p>
<h2>What this means</h2><p>Explain the details.</p>
<h2>Who it is for</h2><ul><li>Audience one</li><li>Audience two</li></ul>
<h2>Key dates</h2><p>List the important dates and deadlines.</p>
<h2>Next steps</h2><p>Tell readers exactly what to do next.</p>`,
  },
];

const BlogEditor = () => {
  const { id } = useParams();
  const { user, loading: authLoading, can } = useAuth();
  const canEditBlog = can('blog');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logActivity } = useActivityLog();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    author: 'Regamos Foundation',
    image_url: '',
  });

  useEffect(() => {
    if (!authLoading && (!user || !canEditBlog)) {
      navigate('/auth?next=/blog-editor', { replace: true });
    }
  }, [user, authLoading, canEditBlog, navigate]);

  useEffect(() => {
    if (id && user && canEditBlog) {
      fetchPost();
    }
  }, [id, user, canEditBlog]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title,
          excerpt: (data.excerpt || '').replace(/<[^>]*>/g, '').trim(),
          content: data.content,
          category: data.category,
          author: data.author || 'Regamos Foundation',
          image_url: data.image_url || '',
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load blog post.',
      });
      navigate('/admin');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        const { error } = await supabase
          .from('blog_posts')
          .update(formData)
          .eq('id', id);

        if (error) throw error;

        await logActivity({
          entityType: 'blog_post',
          actionType: 'updated',
          entityId: id,
          entityName: formData.title,
          details: { category: formData.category, author: formData.author },
        });

        toast({ title: 'Success!', description: 'Blog post updated successfully.' });
      } else {
        const { data, error } = await supabase.from('blog_posts').insert([
          {
            ...formData,
            published_at: new Date().toISOString(),
          },
        ]).select().single();

        if (error) throw error;

        await logActivity({
          entityType: 'blog_post',
          actionType: 'created',
          entityId: data?.id,
          entityName: formData.title,
          details: { category: formData.category, author: formData.author },
        });

        toast({ title: 'Success!', description: 'Blog post published successfully.' });
      }

      navigate('/blog');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || `Failed to ${id ? 'update' : 'publish'} blog post.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const applyTemplate = (html: string) => {
    const hasContent = formData.content.replace(/<[^>]*>/g, '').trim().length > 0;
    if (hasContent && !window.confirm('This will add the template below your current content. Continue?')) return;
    setFormData((prev) => ({ ...prev, content: hasContent ? `${prev.content}${html}` : html }));
    setShowPreview(false);
  };

  const words = formData.content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !canEditBlog) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <Button variant="ghost" className="mb-6" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">
              {id ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
            <p className="text-muted-foreground mt-2">
              Work through the steps below — details, cover image, then the story itself.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1 — Post details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-5 w-5 text-primary" />
                  1. Post details
                </CardTitle>
                <CardDescription>Headline, category and the short summary shown in listings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g. How 40 widows rebuilt their businesses in Lagos"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.title.length}/70 characters — keep it under 70 for search results.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleChange('category', value)}
                      required
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Empowerment">Empowerment</SelectItem>
                        <SelectItem value="Community">Community</SelectItem>
                        <SelectItem value="Programs">Programs</SelectItem>
                        <SelectItem value="Youth Development">Youth Development</SelectItem>
                        <SelectItem value="Mental Health">Mental Health</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      placeholder="Author name"
                      value={formData.author}
                      onChange={(e) => handleChange('author', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Summary *</Label>
                  <Textarea
                    id="excerpt"
                    rows={3}
                    maxLength={300}
                    placeholder="One or two plain sentences summarising the post. Shown on the blog listing and in search results."
                    value={formData.excerpt}
                    onChange={(e) => handleChange('excerpt', e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">{formData.excerpt.length}/300 characters</p>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 — Cover image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  2. Cover image
                </CardTitle>
                <CardDescription>Appears at the top of the post and on social shares. Landscape works best.</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  label="Featured Image"
                  value={formData.image_url}
                  onChange={(url) => handleChange('image_url', url)}
                  accept="image/*"
                />
              </CardContent>
            </Card>

            {/* Step 3 — Content */}
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <PenLine className="h-5 w-5 text-primary" />
                      3. Write the post
                    </CardTitle>
                    <CardDescription>
                      Use headings to split sections, quotes for voices, and images between paragraphs.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{words} words · {Math.max(1, Math.round(words / 225))} min read</span>
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowPreview((p) => !p)}>
                      {showPreview ? 'Back to editing' : 'Preview'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showPreview && (
                  <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium">Start from a structure</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {STRUCTURE_TEMPLATES.map((tpl) => (
                        <button
                          key={tpl.name}
                          type="button"
                          onClick={() => applyTemplate(tpl.html)}
                          className="text-left rounded-lg border border-border bg-background p-3 transition-smooth hover:border-primary hover:shadow-soft"
                        >
                          <span className="block text-sm font-semibold">{tpl.name}</span>
                          <span className="block text-xs text-muted-foreground mt-1">{tpl.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {showPreview ? (
                  <div className="rounded-lg border border-border bg-background p-4 sm:p-8">
                    {formData.title && <h1 className="text-3xl font-bold mb-6">{formData.title}</h1>}
                    <div
                      className="blog-content max-w-none"
                      dangerouslySetInnerHTML={{ __html: formData.content || '<p>Nothing to preview yet.</p>' }}
                    />
                  </div>
                ) : (
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => handleChange('content', value)}
                    placeholder="Write your blog post here. Start with a strong opening paragraph…"
                    minHeight="520px"
                    showQuickInserts
                  />
                )}
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 pb-4">
              <Button type="submit" variant="cta" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {id ? 'Updating...' : 'Publishing...'}
                  </>
                ) : (
                  id ? 'Update Blog Post' : 'Publish Blog Post'
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogEditor;
