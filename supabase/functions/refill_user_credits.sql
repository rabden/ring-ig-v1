CREATE OR REPLACE FUNCTION public.refill_user_credits()
RETURNS void AS $$
BEGIN
    UPDATE public.profiles
    SET 
        credit_count = 50,
        last_refill_time = CURRENT_TIMESTAMP
    WHERE 
        last_refill_time < CURRENT_TIMESTAMP - INTERVAL '24 hours'
        AND credit_count < 50;  -- Only refill if credits are below 50
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;