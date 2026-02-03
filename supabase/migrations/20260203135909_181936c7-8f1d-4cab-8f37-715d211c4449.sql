-- Add view_count column to blog_posts table
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Create function to increment view count
CREATE OR REPLACE FUNCTION public.increment_view_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.blog_posts 
  SET view_count = COALESCE(view_count, 0) + 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;