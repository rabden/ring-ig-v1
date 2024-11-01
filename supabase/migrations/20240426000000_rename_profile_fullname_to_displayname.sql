-- Rename full_name column to display_name in profiles table
ALTER TABLE public.profiles 
RENAME COLUMN full_name TO display_name;

-- Update any existing triggers or functions that reference full_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'display_name',  -- First try display_name from metadata
            NEW.raw_app_meta_data->>'display_name',   -- Then try display_name from app metadata
            NEW.raw_user_meta_data->>'name',          -- Then try name from metadata
            split_part(NEW.email, '@', 1)            -- Finally fallback to email username
        ),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing profiles with display_name from auth.users if available
UPDATE public.profiles p
SET display_name = COALESCE(
    u.raw_user_meta_data->>'display_name',
    u.raw_app_meta_data->>'display_name',
    u.raw_user_meta_data->>'name',
    split_part(u.email, '@', 1)
)
FROM auth.users u
WHERE p.id = u.id;