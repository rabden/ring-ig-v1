-- Create a new storage bucket for profile pictures if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public read access to profile pictures" ON storage.objects;
    DROP POLICY IF EXISTS "Users can upload profile pictures" ON storage.objects;
    DROP POLICY IF EXISTS "Users can update their profile pictures" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete their profile pictures" ON storage.objects;
    
    -- Create new policies with proper permissions
    -- Allow users to upload their profile pictures
    CREATE POLICY "Users can upload profile pictures" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'profile-pictures'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

    -- Allow users to manage their own profile pictures
    CREATE POLICY "Users can update their profile pictures" ON storage.objects
    FOR UPDATE TO authenticated
    USING (
        bucket_id = 'profile-pictures'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

    -- Allow users to delete their own profile pictures
    CREATE POLICY "Users can delete their profile pictures" ON storage.objects
    FOR DELETE TO authenticated
    USING (
        bucket_id = 'profile-pictures'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

    -- Allow public read access to all profile pictures
    CREATE POLICY "Allow public read access to profile pictures" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'profile-pictures');
END $$;