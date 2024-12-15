-- Create image_generations table
CREATE TABLE public.image_generations (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt text NOT NULL,
    model text NOT NULL,
    seed integer NOT NULL,
    width integer NOT NULL,
    height integer NOT NULL,
    quality text NOT NULL,
    aspect_ratio text,
    status text NOT NULL DEFAULT 'pending',
    started_at timestamp with time zone DEFAULT current_timestamp,
    completed_at timestamp with time zone,
    storage_path text,
    is_private boolean DEFAULT false,
    error text
);

-- Add indexes
CREATE INDEX idx_image_generations_user_id ON public.image_generations(user_id);
CREATE INDEX idx_image_generations_status ON public.image_generations(status);

-- Add RLS policies
ALTER TABLE public.image_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own generations"
    ON public.image_generations
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own generations"
    ON public.image_generations
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generations"
    ON public.image_generations
    FOR UPDATE
    USING (auth.uid() = user_id);