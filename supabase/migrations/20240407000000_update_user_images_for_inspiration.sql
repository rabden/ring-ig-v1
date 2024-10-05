-- Add a new column to distinguish between user's own images and inspiration images
ALTER TABLE public.user_images ADD COLUMN IF NOT EXISTS is_inspiration BOOLEAN DEFAULT false;

-- Update the existing policy to allow users to view their own images and inspiration images
DROP POLICY IF EXISTS user_images_policy ON public.user_images;
CREATE POLICY user_images_policy ON public.user_images
    FOR SELECT
    USING (
        auth.uid() = user_id 
        OR 
        is_inspiration = true
    );

-- Create a new policy to allow users to insert only their own images
CREATE POLICY user_images_insert_policy ON public.user_images
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create a new policy to allow users to update only their own images
CREATE POLICY user_images_update_policy ON public.user_images
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create a new policy to allow users to delete only their own images
CREATE POLICY user_images_delete_policy ON public.user_images
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create an index on the is_inspiration column for faster queries
CREATE INDEX IF NOT EXISTS idx_user_images_is_inspiration ON public.user_images(is_inspiration);