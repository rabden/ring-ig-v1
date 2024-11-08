-- Add steps column to user_images table
ALTER TABLE public.user_images 
ADD COLUMN IF NOT EXISTS steps INTEGER;

-- Set default value for existing rows
UPDATE public.user_images 
SET steps = 30 
WHERE steps IS NULL;

-- Make steps column NOT NULL after setting defaults
ALTER TABLE public.user_images 
ALTER COLUMN steps SET NOT NULL;