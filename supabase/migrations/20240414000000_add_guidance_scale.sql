-- Add guidance_scale column to user_images table
ALTER TABLE public.user_images 
ADD COLUMN guidance_scale FLOAT DEFAULT 3.5;