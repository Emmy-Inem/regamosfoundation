ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

ALTER TABLE public.blog_posts DROP CONSTRAINT IF EXISTS blog_posts_status_check;
ALTER TABLE public.blog_posts ADD CONSTRAINT blog_posts_status_check CHECK (status IN ('draft','published'));

CREATE INDEX IF NOT EXISTS blog_posts_status_published_at_idx ON public.blog_posts (status, published_at DESC);

DROP POLICY IF EXISTS "Public can view blog posts" ON public.blog_posts;
CREATE POLICY "Public can view published blog posts"
ON public.blog_posts FOR SELECT
TO anon, authenticated
USING (
  (status = 'published' AND (published_at IS NULL OR published_at <= now()))
  OR public.can_manage(auth.uid(), 'blog')
);