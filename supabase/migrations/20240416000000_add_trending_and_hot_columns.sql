DO $$ 
BEGIN 
    -- Add is_trending column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'user_images' 
                  AND column_name = 'is_trending') THEN
        ALTER TABLE public.user_images 
        ADD COLUMN is_trending BOOLEAN NOT NULL DEFAULT false;
    END IF;

    -- Add is_hot column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'user_images' 
                  AND column_name = 'is_hot') THEN
        ALTER TABLE public.user_images 
        ADD COLUMN is_hot BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;