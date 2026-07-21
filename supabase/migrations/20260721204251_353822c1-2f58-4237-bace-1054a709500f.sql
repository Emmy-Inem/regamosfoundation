ALTER TABLE public.upcoming_programs 
  ADD COLUMN IF NOT EXISTS gallery_urls text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS highlight_writeup text;