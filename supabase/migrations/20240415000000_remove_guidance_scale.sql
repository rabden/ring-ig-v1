-- Remove guidance_scale column from user_images table
ALTER TABLE public.user_images 
DROP COLUMN IF EXISTS guidance_scale;