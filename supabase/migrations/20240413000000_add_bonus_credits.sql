-- Add bonus_credits column to user_credits table
ALTER TABLE public.user_credits 
ADD COLUMN bonus_credits INTEGER NOT NULL DEFAULT 0;

-- Update the function that handles credit updates to consider bonus credits
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

-- Update the handle_new_user function to include bonus_credits
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_credits (user_id, credit_count, bonus_credits, last_refill_time)
    VALUES (NEW.id, 50, 0, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        credit_count = EXCLUDED.credit_count,
        last_refill_time = EXCLUDED.last_refill_time;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to add bonus credits
CREATE OR REPLACE FUNCTION public.add_bonus_credits(
    p_user_id UUID,
    p_bonus_amount INTEGER
)
RETURNS INTEGER AS $$
DECLARE
    v_new_bonus_credits INTEGER;
BEGIN
    UPDATE public.user_credits
    SET bonus_credits = bonus_credits + p_bonus_amount
    WHERE user_id = p_user_id
    RETURNING bonus_credits INTO v_new_bonus_credits;

    RETURN v_new_bonus_credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the daily refill function to not affect bonus credits
CREATE OR REPLACE FUNCTION public.refill_user_credits()
RETURNS void AS $$
BEGIN
    UPDATE public.user_credits
    SET credit_count = 50,
        last_refill_time = CURRENT_TIMESTAMP
    WHERE last_refill_time < CURRENT_TIMESTAMP - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;