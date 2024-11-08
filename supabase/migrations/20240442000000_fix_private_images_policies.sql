-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own images and public images" ON public.user_images;
DROP POLICY IF EXISTS "Users can insert their own images" ON public.user_images;
DROP POLICY IF EXISTS "Users can update their own images" ON public.user_images;
DROP POLICY IF EXISTS "Users can delete their own images" ON public.user_images;

-- Recreate policies with correct privacy handling
CREATE POLICY "Users can view their own images and public images"
ON public.user_images
FOR SELECT
USING (
    auth.uid() = user_id -- User can always see their own images
    OR 
    (is_private = false) -- Anyone can see public images
);

-- Policy for inserting images (user can only insert their own)
CREATE POLICY "Users can insert their own images"
ON public.user_images
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy for updating images (user can only update their own)
CREATE POLICY "Users can update their own images"
ON public.user_images
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy for deleting images (user can only delete their own)
CREATE POLICY "Users can delete their own images"
ON public.user_images
FOR DELETE
USING (auth.uid() = user_id);

-- Create an index for faster queries involving privacy
CREATE INDEX IF NOT EXISTS idx_user_images_privacy 
ON public.user_images(user_id, is_private);