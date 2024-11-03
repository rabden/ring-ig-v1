-- Add is_private column to user_images table
ALTER TABLE public.user_images 
ADD COLUMN is_private BOOLEAN NOT NULL DEFAULT false;

-- Update policies to respect privacy settings
DROP POLICY IF EXISTS user_images_policy ON public.user_images;

-- Policy for viewing images (respect privacy)
CREATE POLICY "Users can view their own images and public images from others" ON public.user_images
    FOR SELECT
    USING (
        auth.uid() = user_id 
        OR 
        (is_private = false)
    );

-- Policy for inserting images
CREATE POLICY "Users can insert their own images" ON public.user_images
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy for updating images
CREATE POLICY "Users can update their own images" ON public.user_images
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy for deleting images
CREATE POLICY "Users can delete their own images" ON public.user_images
    FOR DELETE
    USING (auth.uid() = user_id);