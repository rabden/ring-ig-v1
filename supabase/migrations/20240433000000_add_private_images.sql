-- Add is_private column to user_images table
ALTER TABLE public.user_images
ADD COLUMN is_private BOOLEAN DEFAULT false;

-- Create index for faster queries
CREATE INDEX idx_user_images_is_private ON public.user_images(is_private);

-- Update RLS policies to respect privacy settings
DROP POLICY IF EXISTS user_images_policy ON public.user_images;

-- Policy for viewing images (respects privacy)
CREATE POLICY "Users can view their own images and public images"
ON public.user_images
FOR SELECT
USING (
  auth.uid() = user_id 
  OR 
  (is_private = false)
);

-- Policy for inserting images
CREATE POLICY "Users can insert their own images"
ON public.user_images
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy for updating images
CREATE POLICY "Users can update their own images"
ON public.user_images
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy for deleting images
CREATE POLICY "Users can delete their own images"
ON public.user_images
FOR DELETE
USING (auth.uid() = user_id);