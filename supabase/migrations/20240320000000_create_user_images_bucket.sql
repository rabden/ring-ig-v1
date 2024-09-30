-- Create a new storage bucket for user images if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('user-images', 'user-images')
ON CONFLICT (id) DO NOTHING;

-- Set up access policies for the new bucket, checking if they exist first
DO $$
BEGIN
    -- Policy for INSERT
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Give users access to own folder 1z0u1xj_0'
    ) THEN
        CREATE POLICY "Give users access to own folder 1z0u1xj_0" ON storage.objects
        FOR INSERT TO authenticated
        WITH CHECK (bucket_id = 'user-images' AND auth.uid()::text = (storage.foldername(name))[1]);
    END IF;

    -- Policy for SELECT
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Give users access to own folder 1z0u1xj_1'
    ) THEN
        CREATE POLICY "Give users access to own folder 1z0u1xj_1" ON storage.objects
        FOR SELECT TO authenticated
        USING (bucket_id = 'user-images' AND auth.uid()::text = (storage.foldername(name))[1]);
    END IF;

    -- Policy for UPDATE
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Give users access to own folder 1z0u1xj_2'
    ) THEN
        CREATE POLICY "Give users access to own folder 1z0u1xj_2" ON storage.objects
        FOR UPDATE TO authenticated
        USING (bucket_id = 'user-images' AND auth.uid()::text = (storage.foldername(name))[1]);
    END IF;

    -- Policy for DELETE
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Give users access to own folder 1z0u1xj_3'
    ) THEN
        CREATE POLICY "Give users access to own folder 1z0u1xj_3" ON storage.objects
        FOR DELETE TO authenticated
        USING (bucket_id = 'user-images' AND auth.uid()::text = (storage.foldername(name))[1]);
    END IF;
END $$;

-- Create the user_images table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
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

-- Create an index on user_id for faster queries if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_user_images_user_id ON user_images(user_id);

-- Enable Row Level Security (RLS) if not already enabled
ALTER TABLE user_images ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to see only their own images if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_images' 
        AND policyname = 'user_images_policy'
    ) THEN
        CREATE POLICY user_images_policy ON user_images
        FOR ALL
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create a function to automatically delete old images from storage when deleting from the table
CREATE OR REPLACE FUNCTION delete_image_from_storage()
RETURNS TRIGGER AS $$
BEGIN
    -- Assuming the bucket name is 'user-images'
    PERFORM storage.delete('user-images', OLD.image_url);
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a row is deleted if it doesn't exist
DROP TRIGGER IF EXISTS delete_image_trigger ON user_images;
CREATE TRIGGER delete_image_trigger
BEFORE DELETE ON user_images
FOR EACH ROW
EXECUTE FUNCTION delete_image_from_storage();