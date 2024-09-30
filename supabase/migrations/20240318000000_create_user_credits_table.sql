-- Create the user_credits table
CREATE TABLE IF NOT EXISTS user_credits (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    credit_count INTEGER NOT NULL DEFAULT 50,
    last_refill_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Function to create or update user credit record
CREATE OR REPLACE FUNCTION create_user_credit_record()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_credits (user_id, credit_count, last_refill_time)
    VALUES (NEW.id, 50, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        credit_count = CASE 
            WHEN user_credits.last_refill_time < CURRENT_TIMESTAMP - INTERVAL '1 day'
            THEN 50
            ELSE user_credits.credit_count
        END,
        last_refill_time = CASE 
            WHEN user_credits.last_refill_time < CURRENT_TIMESTAMP - INTERVAL '1 day'
            THEN CURRENT_TIMESTAMP
            ELSE user_credits.last_refill_time
        END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function for new and existing users
CREATE OR REPLACE TRIGGER create_user_credit_record_trigger
AFTER INSERT OR UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_user_credit_record();

-- Create credit records for existing users
INSERT INTO user_credits (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;