-- Drop existing table and associated functions/triggers
DROP TABLE IF EXISTS public.user_images;
DROP FUNCTION IF EXISTS delete_image_from_storage();

-- Recreate user_images table
CREATE TABLE public.user_images (
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

-- Ensure the user-images bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-images', 'user-images', false)
ON CONFLICT (id) DO NOTHING;

-- Update storage policies
CREATE POLICY "Users can upload images" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'user-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own images" ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id = 'user-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own images" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'user-images' AND auth.uid()::text = (storage.foldername(name))[1]);