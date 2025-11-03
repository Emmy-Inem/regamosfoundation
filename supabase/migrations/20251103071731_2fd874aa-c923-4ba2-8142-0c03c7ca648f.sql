-- Create storage bucket for content images and files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'content-uploads',
  'content-uploads',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- RLS Policies for content uploads
CREATE POLICY "Anyone can view uploaded files"
ON storage.objects FOR SELECT
USING (bucket_id = 'content-uploads');

CREATE POLICY "Admins can upload files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'content-uploads' 
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'content-uploads' 
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'content-uploads' 
  AND public.has_role(auth.uid(), 'admin'::app_role)
);