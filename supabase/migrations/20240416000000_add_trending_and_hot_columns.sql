-- Add is_trending and is_hot columns to user_images table
ALTER TABLE public.user_images 
ADD COLUMN is_trending BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN is_hot BOOLEAN NOT NULL DEFAULT false;