-- Create pro_users table
CREATE TABLE IF NOT EXISTS public.pro_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.pro_users ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read pro users
CREATE POLICY "Allow authenticated users to read pro_users" ON public.pro_users
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow admins to manage pro users (you'll need to set up admin roles separately)
CREATE POLICY "Allow admins to manage pro_users" ON public.pro_users
    FOR ALL
    TO authenticated
    USING (auth.uid() IN (SELECT user_id FROM admin_users));