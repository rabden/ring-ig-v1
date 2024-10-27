-- Add style column to user_images table
ALTER TABLE public.user_images 
ADD COLUMN style TEXT NOT NULL DEFAULT 'general';

-- Remove steps column as it's no longer needed in details
ALTER TABLE public.user_images 
DROP COLUMN steps;