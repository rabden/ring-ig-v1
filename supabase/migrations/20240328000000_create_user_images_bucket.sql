-- Create a new storage bucket for user images
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-images', 'user-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up access policies for the new bucket
CREATE POLICY "Give users access to own folder" ON storage.objects
FOR ALL USING (
  bucket_id = 'user-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to all objects in the bucket
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'user-images');