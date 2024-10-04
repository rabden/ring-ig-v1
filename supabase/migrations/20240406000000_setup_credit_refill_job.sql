-- Enable the pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a scheduled job to run the refill_user_credits function every hour
SELECT cron.schedule('refill_user_credits_hourly', '0 * * * *', 'SELECT public.refill_user_credits()');