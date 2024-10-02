-- Drop existing table, triggers, and functions
DROP TABLE IF EXISTS public.user_credits;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create new user_credits table
CREATE TABLE public.user_credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL,
    credit_count INTEGER NOT NULL DEFAULT 50,
    last_refill_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

-- Create index on user_id
CREATE INDEX idx_user_credits_user_id ON public.user_credits(user_id);

-- Create function to handle new user credit creation
CREATE OR REPLACE FUNCTION public.create_user_credit_record()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_credits (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function after user creation
CREATE TRIGGER after_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_credit_record();

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.user_credits TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_credits TO service_role;

-- Populate user_credits for existing users
INSERT INTO public.user_credits (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;