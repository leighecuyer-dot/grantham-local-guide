
-- Create storage bucket for business images
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-images', 'business-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to business images
CREATE POLICY "Public can view business images"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-images');

-- Allow authenticated admins to upload business images
CREATE POLICY "Admins can upload business images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'business-images' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow authenticated admins to update business images
CREATE POLICY "Admins can update business images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'business-images' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow authenticated admins to delete business images
CREATE POLICY "Admins can delete business images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'business-images' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);
