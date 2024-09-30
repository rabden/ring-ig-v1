-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create an updated function to handle user credit record creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_credits (user_id, credit_count, last_refill_time)
    VALUES (NEW.id, 50, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        credit_count = CASE 
            WHEN public.user_credits.last_refill_time < CURRENT_TIMESTAMP - INTERVAL '1 day'
            THEN 50
            ELSE public.user_credits.credit_count
        END,
        last_refill_time = CASE 
            WHEN public.user_credits.last_refill_time < CURRENT_TIMESTAMP - INTERVAL '1 day'
            THEN CURRENT_TIMESTAMP
            ELSE public.user_credits.last_refill_time
        END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a new trigger that uses the updated function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure all existing users have credit records
INSERT INTO public.user_credits (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;