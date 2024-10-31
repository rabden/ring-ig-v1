CREATE OR REPLACE FUNCTION public.update_user_credits(
    p_user_id UUID,
    p_credit_cost INTEGER
)
RETURNS INTEGER AS $$
DECLARE
    v_current_credits INTEGER;
    v_bonus_credits INTEGER;
    v_remaining_cost INTEGER;
    v_new_credits INTEGER;
    v_new_bonus_credits INTEGER;
BEGIN
    -- Get current credit counts
    SELECT credit_count, bonus_credits 
    INTO v_current_credits, v_bonus_credits
    FROM public.user_credits
    WHERE user_id = p_user_id;

    -- Check if user has enough total credits
    IF (v_current_credits + v_bonus_credits) < p_credit_cost THEN
        RETURN -1; -- Indicate insufficient credits
    END IF;

    -- First use regular credits
    IF v_current_credits >= p_credit_cost THEN
        -- Only regular credits are needed
        v_new_credits := v_current_credits - p_credit_cost;
        v_new_bonus_credits := v_bonus_credits;
    ELSE
        -- Use all regular credits and some bonus credits
        v_remaining_cost := p_credit_cost - v_current_credits;
        v_new_credits := 0;
        v_new_bonus_credits := v_bonus_credits - v_remaining_cost;
    END IF;

    -- Update credits
    UPDATE public.user_credits
    SET credit_count = v_new_credits,
        bonus_credits = v_new_bonus_credits
    WHERE user_id = p_user_id;

    -- Return total remaining credits
    RETURN v_new_credits + v_new_bonus_credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;