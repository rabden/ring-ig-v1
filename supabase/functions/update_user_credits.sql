CREATE OR REPLACE FUNCTION public.update_user_credits(
    p_user_id UUID,
    p_quality TEXT
)
RETURNS INTEGER AS $$
DECLARE
    v_credit_cost INTEGER;
    v_current_credits INTEGER;
    v_new_credits INTEGER;
BEGIN
    -- Determine credit cost based on quality
    CASE p_quality
        WHEN 'SD' THEN v_credit_cost := 1;
        WHEN 'HD' THEN v_credit_cost := 2;
        WHEN 'HD+' THEN v_credit_cost := 3;
        WHEN '4K' THEN v_credit_cost := 4;
        ELSE
            RAISE EXCEPTION 'Invalid quality specified';
    END CASE;

    -- Get current credit count
    SELECT credit_count INTO v_current_credits
    FROM public.user_credits
    WHERE user_id = p_user_id;

    -- Check if user has enough credits
    IF v_current_credits < v_credit_cost THEN
        RETURN -1; -- Indicate insufficient credits
    END IF;

    -- Update credits
    v_new_credits := v_current_credits - v_credit_cost;
    
    UPDATE public.user_credits
    SET credit_count = v_new_credits
    WHERE user_id = p_user_id;

    RETURN v_new_credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;