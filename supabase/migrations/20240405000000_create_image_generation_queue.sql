-- Create the image_generation_queue table
CREATE TABLE public.image_generation_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    model TEXT NOT NULL,
    seed INTEGER NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    steps INTEGER NOT NULL,
    quality TEXT NOT NULL,
    aspect_ratio TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on status and created_at for faster queries
CREATE INDEX idx_image_generation_queue_status_created_at ON public.image_generation_queue(status, created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.image_generation_queue ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to insert their own requests
CREATE POLICY "Users can insert their own requests" ON public.image_generation_queue
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to view their own requests
CREATE POLICY "Users can view their own requests" ON public.image_generation_queue
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_image_generation_queue_modtime
BEFORE UPDATE ON public.image_generation_queue
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();