-- Add credit columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN credit_count INTEGER NOT NULL DEFAULT 50,
ADD COLUMN bonus_credits INTEGER NOT NULL DEFAULT 0,
ADD COLUMN last_refill_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Migrate existing credits data
UPDATE public.profiles p
SET 
  credit_count = COALESCE((SELECT credit_count FROM user_credits WHERE user_id = p.id), 50),
  bonus_credits = COALESCE((SELECT bonus_credits FROM user_credits WHERE user_id = p.id), 0),
  last_refill_time = COALESCE((SELECT last_refill_time FROM user_credits WHERE user_id = p.id), CURRENT_TIMESTAMP);

-- Drop old user_credits table
DROP TABLE IF EXISTS user_credits;