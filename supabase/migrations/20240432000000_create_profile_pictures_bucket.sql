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
    
    -- Create new policies
    CREATE POLICY "Give users access to own folder" ON storage.objects
    FOR ALL USING (
      bucket_id = 'profile-pictures' 
      AND auth.uid()::text = (storage.foldername(name))[1]
    );

    CREATE POLICY "Allow public read access to profile pictures" ON storage.objects
    FOR SELECT USING (bucket_id = 'profile-pictures');
END $$;