-- Create function to send welcome notification
CREATE OR REPLACE FUNCTION public.send_welcome_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (
    user_id,
    title,
    message,
    link,
    link_names,
    is_read
  ) VALUES (
    NEW.id,
    'Welcome to our platform!',
    'Get started by reading our documentation to learn about all the features available.',
    '/docs',
    'Documentation',
    false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to send welcome notification on user creation
DROP TRIGGER IF EXISTS on_user_created_welcome ON auth.users;
CREATE TRIGGER on_user_created_welcome
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.send_welcome_notification();