-- Create the user_credits table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_credits (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    credit_count INTEGER NOT NULL DEFAULT 50,
    last_refill_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.user_credits TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_credits TO service_role;

-- Update the handle_new_user function to handle potential errors
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Attempt to insert a new record or update existing one
    INSERT INTO public.user_credits (user_id, credit_count, last_refill_time)
    VALUES (NEW.id, 50, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        credit_count = EXCLUDED.credit_count,
        last_refill_time = EXCLUDED.last_refill_time;
    
    -- If we reach this point, the operation was successful
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error (consider using a more robust logging mechanism in production)
        RAISE NOTICE 'Error in handle_new_user function: %', SQLERRM;
        
        -- Despite the error, we still want to create the user, so we return NEW
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger is correctly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();