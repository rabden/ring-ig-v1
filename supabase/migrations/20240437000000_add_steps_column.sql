-- Add steps column to user_images table
ALTER TABLE public.user_images
ADD COLUMN IF NOT EXISTS steps INTEGER NOT NULL DEFAULT 30;