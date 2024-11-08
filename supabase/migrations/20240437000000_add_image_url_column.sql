-- Add image_url column to user_images table
ALTER TABLE public.user_images 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update existing records to populate image_url based on storage_path
UPDATE public.user_images
SET image_url = storage.fspath('user-images', storage_path)
WHERE image_url IS NULL;