-- Add style column to user_images table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 
                  FROM information_schema.columns 
                  WHERE table_schema='public' 
                  AND table_name='user_images' 
                  AND column_name='style') THEN
        ALTER TABLE public.user_images ADD COLUMN style TEXT NULL;
    END IF;
END $$;

-- Remove steps column if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 
              FROM information_schema.columns 
              WHERE table_schema='public' 
              AND table_name='user_images' 
              AND column_name='steps') THEN
        ALTER TABLE public.user_images DROP COLUMN steps;
    END IF;
END $$;