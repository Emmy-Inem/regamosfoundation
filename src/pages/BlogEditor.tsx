import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Loader2, ArrowLeft } from 'lucide-react';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { ImageUpload } from '@/components/ui/image-upload';
import { useActivityLog } from '@/hooks/useActivityLog';

const BlogEditor = () => {
  const { id } = useParams();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logActivity } = useActivityLog();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    author: 'Regamos Foundation',
    image_url: '',
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/auth?next=/blog-editor', { replace: true });
    }
  }, [user, authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (id && user && isAdmin) {
      fetchPost();
    }
  }, [id, user, isAdmin]);

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
          excerpt: data.excerpt,
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
        // Update existing post
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

        toast({
          title: 'Success!',
          description: 'Blog post updated successfully.',
        });
      } else {
        // Create new post
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

        toast({
          title: 'Success!',
          description: 'Blog post published successfully.',
        });
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate('/admin')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">
                {id ? 'Edit Blog Post' : 'Create New Blog Post'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter blog post title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <RichTextEditor
                    value={formData.excerpt}
                    onChange={(value) => handleChange('excerpt', value)}
                    placeholder="Brief summary of the blog post (shown in listings)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => handleChange('content', value)}
                    placeholder="Write your blog post content here with full formatting options"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleChange('category', value)}
                      required
                    >
                      <SelectTrigger>
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

                <ImageUpload
                  label="Featured Image"
                  value={formData.image_url}
                  onChange={(url) => handleChange('image_url', url)}
                  accept="image/*"
                />

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    variant="cta"
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {id ? 'Updating...' : 'Publishing...'}
                      </>
                    ) : (
                      id ? 'Update Blog Post' : 'Publish Blog Post'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/admin')}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogEditor;
