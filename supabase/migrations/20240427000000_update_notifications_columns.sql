-- Update notifications table to handle multiple images and links
COMMENT ON COLUMN public.notifications.image_url IS 'Comma-separated list of image URLs';
COMMENT ON COLUMN public.notifications.link IS 'Comma-separated list of links';