-- Create a new storage bucket for user images
INSERT INTO storage.buckets (id, name)
VALUES ('user-images', 'user-images')
ON CONFLICT (id) DO NOTHING;

-- Set up access policies for the new bucket
CREATE POLICY "Give users access to own folder 1z0u1xj_0" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'user-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Give users access to own folder 1z0u1xj_1" ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id = 'user-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Give users access to own folder 1z0u1xj_2" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'user-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Give users access to own folder 1z0u1xj_3" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'user-images' AND auth.uid()::text = (storage.foldername(name))[1]);