-- Remove the prompt_weights column and its index
DROP INDEX IF EXISTS idx_user_images_prompt_weights;
ALTER TABLE public.user_images DROP COLUMN IF EXISTS prompt_weights;