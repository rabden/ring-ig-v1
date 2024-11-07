-- Add new columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_pro BOOLEAN DEFAULT false,
ADD COLUMN is_pro_request BOOLEAN DEFAULT false,
ADD COLUMN hidden_global_notifications TEXT DEFAULT '';

-- Migrate existing pro users
UPDATE public.profiles
SET is_pro = true
WHERE id IN (SELECT user_id FROM pro_users);

-- Migrate existing pro requests
UPDATE public.profiles
SET is_pro_request = true
WHERE id IN (SELECT user_id FROM user_pro_requests);

-- Migrate hidden notifications
UPDATE public.profiles p
SET hidden_global_notifications = (
  SELECT string_agg(notification_id::text, ',')
  FROM hidden_global_notifications
  WHERE user_id = p.id
  GROUP BY user_id
);

-- Drop old tables
DROP TABLE IF EXISTS pro_users CASCADE;
DROP TABLE IF EXISTS user_pro_requests CASCADE;
DROP TABLE IF EXISTS hidden_global_notifications CASCADE;