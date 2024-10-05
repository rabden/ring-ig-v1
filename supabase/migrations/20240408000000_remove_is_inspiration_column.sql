-- First, drop the policy that depends on the is_inspiration column
DROP POLICY IF EXISTS user_images_policy ON public.user_images;

-- Create a new policy that allows all authenticated users to view all images
CREATE POLICY user_images_policy ON public.user_images
    FOR SELECT
    USING (true);  -- This allows all authenticated users to view all images

-- Remove the index on the is_inspiration column if it exists
DROP INDEX IF EXISTS idx_user_images_is_inspiration;

-- Now we can safely remove the is_inspiration column
ALTER TABLE public.user_images DROP COLUMN IF EXISTS is_inspiration;