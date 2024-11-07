-- Drop existing table, triggers, and functions
DROP TABLE IF EXISTS public.user_credits;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        display_name,
        avatar_url,
        credit_count,
        bonus_credits,
        last_refill_time,
        is_admin,
        hidden_global_notifications,
        updated_at
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'name'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
        50, -- default credits
        0,  -- default bonus credits
        CURRENT_TIMESTAMP,
        false, -- default is_admin
        '', -- empty hidden notifications
        CURRENT_TIMESTAMP
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function after user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- Ensure all existing users have profile records
INSERT INTO public.profiles (
    id,
    display_name,
    avatar_url,
    credit_count,
    bonus_credits,
    last_refill_time,
    is_admin,
    hidden_global_notifications,
    updated_at
)
SELECT 
    id,
    COALESCE(raw_user_meta_data->>'display_name', raw_user_meta_data->>'name'),
    COALESCE(raw_user_meta_data->>'avatar_url', raw_user_meta_data->>'picture'),
    50,
    0,
    CURRENT_TIMESTAMP,
    false,
    '',
    CURRENT_TIMESTAMP
FROM auth.users
ON CONFLICT (id) DO NOTHING;