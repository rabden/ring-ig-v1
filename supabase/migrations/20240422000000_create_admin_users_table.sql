-- Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read admin users
CREATE POLICY "Allow authenticated users to read admin_users" ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (true);

-- Insert the specified admin users
INSERT INTO public.admin_users (user_id) VALUES 
    ('b574a759-4898-4bd4-8624-5e984407217e'),
    ('d5d8bfee-c6d9-44ac-bf11-d3dc580c1d6f'),
    ('d746dc2b-6fed-4415-9f27-e38891e98116')
ON CONFLICT (user_id) DO NOTHING;