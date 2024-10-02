CREATE OR REPLACE FUNCTION public.refill_user_credits()
RETURNS void AS $$
BEGIN
    UPDATE public.user_credits
    SET credit_count = 50,
        last_refill_time = CURRENT_TIMESTAMP
    WHERE last_refill_time < CURRENT_TIMESTAMP - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;