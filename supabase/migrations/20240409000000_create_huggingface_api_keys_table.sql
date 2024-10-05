-- Create the huggingface_api_keys table
CREATE TABLE public.huggingface_api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_key TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP WITH TIME ZONE
);

-- Insert the provided API keys
INSERT INTO public.huggingface_api_keys (api_key) VALUES
('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'),
('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'),
('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'),
('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'),
('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'),
('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'),
('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'),
('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');

-- Create an index on the is_active column for faster queries
CREATE INDEX idx_huggingface_api_keys_is_active ON public.huggingface_api_keys(is_active);

-- Create a function to get a random active API key
CREATE OR REPLACE FUNCTION get_random_huggingface_api_key()
RETURNS TEXT AS $$
DECLARE
    random_key TEXT;
BEGIN
    SELECT api_key INTO random_key
    FROM public.huggingface_api_keys
    WHERE is_active = true
    ORDER BY RANDOM()
    LIMIT 1;

    IF random_key IS NOT NULL THEN
        UPDATE public.huggingface_api_keys
        SET last_used_at = CURRENT_TIMESTAMP
        WHERE api_key = random_key;
    END IF;

    RETURN random_key;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.huggingface_api_keys TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.huggingface_api_keys TO service_role;
GRANT EXECUTE ON FUNCTION get_random_huggingface_api_key() TO authenticated;
GRANT EXECUTE ON FUNCTION get_random_huggingface_api_key() TO service_role;