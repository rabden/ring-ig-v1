-- First ensure the is_private column exists with correct default
DO $$ 
BEGIN
    -- Check if the column doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'user_images' 
        AND column_name = 'is_private'
    ) THEN
        -- Add the column if it doesn't exist
        ALTER TABLE public.user_images 
        ADD COLUMN is_private BOOLEAN DEFAULT false;
    END IF;

    -- Ensure the column has the correct default value
    ALTER TABLE public.user_images 
    ALTER COLUMN is_private SET DEFAULT false;

    -- Update any NULL values to false
    UPDATE public.user_images 
    SET is_private = false 
    WHERE is_private IS NULL;

    -- Make the column NOT NULL
    ALTER TABLE public.user_images 
    ALTER COLUMN is_private SET NOT NULL;
END $$;

-- Recreate the index to ensure it exists and is optimal
DROP INDEX IF EXISTS idx_user_images_privacy;
CREATE INDEX idx_user_images_privacy 
ON public.user_images(user_id, is_private);

-- Refresh the policies to ensure they're using the correct column
DO $$ 
BEGIN
    -- Recreate the policies
    DROP POLICY IF EXISTS "Users can view their own images and public images" ON public.user_images;
    DROP POLICY IF EXISTS "Users can insert their own images" ON public.user_images;
    DROP POLICY IF EXISTS "Users can update their own images" ON public.user_images;
    DROP POLICY IF EXISTS "Users can delete their own images" ON public.user_images;

    CREATE POLICY "Users can view their own images and public images"
    ON public.user_images
    FOR SELECT
    USING (
        auth.uid() = user_id 
        OR 
        (is_private = false)
    );

    CREATE POLICY "Users can insert their own images"
    ON public.user_images
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own images"
    ON public.user_images
    FOR UPDATE
    USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete their own images"
    ON public.user_images
    FOR DELETE
    USING (auth.uid() = user_id);
END $$;