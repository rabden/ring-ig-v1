-- Create global notifications table
CREATE TABLE IF NOT EXISTS public.global_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    link TEXT,
    image_url TEXT,
    link_names TEXT
);

-- Create hidden global notifications table to track which users have hidden which notifications
CREATE TABLE IF NOT EXISTS public.hidden_global_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    notification_id UUID REFERENCES public.global_notifications(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, notification_id)
);

-- Enable RLS
ALTER TABLE public.global_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hidden_global_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can view global notifications" ON public.global_notifications
    FOR SELECT USING (true);

CREATE POLICY "Users can hide global notifications" ON public.hidden_global_notifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their hidden notifications" ON public.hidden_global_notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Create function to send notification when user becomes pro
CREATE OR REPLACE FUNCTION public.notify_pro_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.notifications (user_id, title, message)
    VALUES (NEW.user_id, 'Welcome to Pro!', 'You are now a pro user. Enjoy all the premium features!');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for pro user notifications
CREATE TRIGGER on_pro_user_created
    AFTER INSERT ON public.pro_users
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_pro_user();

-- Grant necessary permissions
GRANT SELECT ON public.global_notifications TO authenticated;
GRANT ALL ON public.hidden_global_notifications TO authenticated;