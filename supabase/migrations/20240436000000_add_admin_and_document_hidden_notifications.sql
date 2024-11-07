-- Add is_admin column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- Add comment to document hidden_global_notifications format
COMMENT ON COLUMN public.profiles.hidden_global_notifications IS 'Comma-separated list of hidden global notification IDs';

-- Update existing admin users
UPDATE public.profiles
SET is_admin = true
WHERE id IN (
    SELECT user_id 
    FROM admin_users
);

-- Drop the old admin_users table
DROP TABLE IF EXISTS admin_users;