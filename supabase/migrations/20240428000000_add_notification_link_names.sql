-- Add link_names column to notifications table
ALTER TABLE public.notifications 
ADD COLUMN link_names TEXT;

COMMENT ON COLUMN public.notifications.link_names IS 'Comma-separated list of link names corresponding to links';