-- Add is_private column to user_images table
ALTER TABLE public.user_images 
ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT false;

-- Update policies to handle private images
DROP POLICY IF EXISTS user_images_policy ON public.user_images;

CREATE POLICY user_images_policy ON public.user_images
    FOR SELECT
    USING (
        (auth.uid() = user_id) OR 
        (is_private = false AND auth.uid() != user_id)
    );