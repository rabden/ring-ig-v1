-- Add insert policy for notifications table
CREATE POLICY "Users can insert notifications for other users" ON public.notifications
    FOR INSERT
    WITH CHECK (true);  -- Allow any authenticated user to create notifications

-- Ensure notifications table has RLS enabled
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT INSERT ON public.notifications TO authenticated;