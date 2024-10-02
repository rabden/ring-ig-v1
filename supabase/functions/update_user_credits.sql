CREATE OR REPLACE FUNCTION public.update_user_credits(
    p_user_id UUID,
    p_credit_cost INTEGER
)
RETURNS INTEGER AS $$
DECLARE
    v_current_credits INTEGER;
    v_new_credits INTEGER;
BEGIN
    -- Get current credit count
    SELECT credit_count INTO v_current_credits
    FROM public.user_credits
    WHERE user_id = p_user_id;

    -- Check if user has enough credits
    IF v_current_credits < p_credit_cost THEN
        RETURN -1; -- Indicate insufficient credits
    END IF;

    -- Update credits
    v_new_credits := v_current_credits - p_credit_cost;
    
    UPDATE public.user_credits
    SET credit_count = v_new_credits
    WHERE user_id = p_user_id;

    RETURN v_new_credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;