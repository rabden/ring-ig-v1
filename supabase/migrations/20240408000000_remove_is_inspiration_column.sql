-- Remove the is_inspiration column from the user_images table
ALTER TABLE public.user_images DROP COLUMN IF EXISTS is_inspiration;

-- Update the existing policy to allow users to view all images
DROP POLICY IF EXISTS user_images_policy ON public.user_images;
CREATE POLICY user_images_policy ON public.user_images
    FOR SELECT
    USING (true);  -- This allows all authenticated users to view all images

-- Remove the index on the is_inspiration column if it exists
DROP INDEX IF EXISTS idx_user_images_is_inspiration;