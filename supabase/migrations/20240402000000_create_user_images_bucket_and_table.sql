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

-- Create a table to store image metadata
CREATE TABLE IF NOT EXISTS public.user_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    prompt TEXT NOT NULL,
    model TEXT NOT NULL,
    seed INTEGER NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    steps INTEGER NOT NULL,
    quality TEXT NOT NULL,
    aspect_ratio TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_user_images_user_id ON public.user_images(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_images ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to see only their own images
CREATE POLICY user_images_policy ON public.user_images
    FOR ALL
    USING (auth.uid() = user_id);

-- Function to delete image from storage when deleted from the table
CREATE OR REPLACE FUNCTION delete_image_from_storage()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM storage.delete('user-images', OLD.storage_path);
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a row is deleted
CREATE TRIGGER delete_image_trigger
BEFORE DELETE ON public.user_images
FOR EACH ROW
EXECUTE FUNCTION delete_image_from_storage();