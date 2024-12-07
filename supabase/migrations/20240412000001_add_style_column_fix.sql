-- Add style column to user_images table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 
                  FROM information_schema.columns 
                  WHERE table_schema='public' 
                  AND table_name='user_images' 
                  AND column_name='style') THEN
        ALTER TABLE public.user_images ADD COLUMN style TEXT;
    END IF;
END $$;

-- Update existing records to have a default style if needed
UPDATE public.user_images 
SET style = 'general' 
WHERE style IS NULL;

-- Add comment to document the column
COMMENT ON COLUMN public.user_images.style IS 'The style preset used for image generation';