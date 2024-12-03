-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    display_name TEXT,
    avatar_url TEXT,
    credit_count INTEGER NOT NULL DEFAULT 50,
    bonus_credits INTEGER NOT NULL DEFAULT 0,
    last_refill_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT false,
    is_pro BOOLEAN DEFAULT false,
    is_pro_request BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_images table
CREATE TABLE IF NOT EXISTS public.user_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    prompt TEXT NOT NULL,
    model TEXT NOT NULL,
    seed INTEGER NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    quality TEXT NOT NULL,
    style TEXT,
    aspect_ratio TEXT NOT NULL,
    is_private BOOLEAN DEFAULT false,
    is_trending BOOLEAN DEFAULT false,
    is_hot BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_image_likes table
CREATE TABLE IF NOT EXISTS public.user_image_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    image_id UUID REFERENCES public.user_images(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, image_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    link_names TEXT,
    image_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create global_notifications table
CREATE TABLE IF NOT EXISTS public.global_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    link_names TEXT,
    image_url TEXT,
    hidden_by TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create model_configs table
CREATE TABLE IF NOT EXISTS public.model_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    api_url TEXT NOT NULL,
    inference_steps INTEGER[] NOT NULL,
    default_step INTEGER NOT NULL,
    quality_limits TEXT[] DEFAULT NULL,
    no_style_suffix BOOLEAN DEFAULT false,
    is_premium BOOLEAN DEFAULT false,
    prompt_suffix TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create style_configs table
CREATE TABLE IF NOT EXISTS public.style_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    suffix TEXT NOT NULL,
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create huggingface_api_keys table
CREATE TABLE IF NOT EXISTS public.huggingface_api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_key TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('user-images', 'user-images', true),
    ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_image_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.style_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.huggingface_api_keys ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create policies for user_images
CREATE POLICY "Users can view their own images and public images" ON public.user_images
    FOR SELECT USING (auth.uid() = user_id OR (is_private = false));

CREATE POLICY "Users can insert their own images" ON public.user_images
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own images" ON public.user_images
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images" ON public.user_images
    FOR DELETE USING (auth.uid() = user_id);

-- Create policies for user_image_likes
CREATE POLICY "Users can insert their own likes" ON public.user_image_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON public.user_image_likes
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view likes" ON public.user_image_likes
    FOR SELECT USING (true);

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for global notifications
CREATE POLICY "Everyone can view global notifications" ON public.global_notifications
    FOR SELECT USING (true);

-- Create policies for model_configs and style_configs
CREATE POLICY "Allow public read access to model_configs" ON public.model_configs
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to style_configs" ON public.style_configs
    FOR SELECT USING (true);

-- Create storage policies
CREATE POLICY "Users can upload profile pictures" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (
        bucket_id = 'profile-pictures'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can manage their profile pictures" ON storage.objects
    FOR ALL TO authenticated USING (
        bucket_id = 'profile-pictures'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Public can view profile pictures" ON storage.objects
    FOR SELECT USING (bucket_id = 'profile-pictures');

CREATE POLICY "Users can upload images" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (
        bucket_id = 'user-images'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can manage their images" ON storage.objects
    FOR ALL TO authenticated USING (
        bucket_id = 'user-images'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Public can view user images" ON storage.objects
    FOR SELECT USING (bucket_id = 'user-images');

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        display_name,
        avatar_url,
        credit_count,
        bonus_credits,
        last_refill_time,
        updated_at
    ) VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'display_name',
            NEW.raw_user_meta_data->>'name',
            split_part(NEW.email, '@', 1)
        ),
        COALESCE(
            NEW.raw_user_meta_data->>'avatar_url',
            NEW.raw_user_meta_data->>'picture'
        ),
        50,
        0,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create function to update trending and hot status
CREATE OR REPLACE FUNCTION update_trending_and_hot_status()
RETURNS void AS $$
DECLARE
  total_images INTEGER;
BEGIN
  SELECT COUNT(DISTINCT ui.id)
  INTO total_images
  FROM user_images ui
  INNER JOIN user_image_likes uil ON ui.id = uil.image_id;

  UPDATE user_images
  SET is_trending = false,
      is_hot = false;

  IF total_images > 0 THEN
    WITH ranked_images AS (
      SELECT 
        ui.id,
        COUNT(uil.id) as like_count,
        ROW_NUMBER() OVER (ORDER BY COUNT(uil.id) DESC) as rank
      FROM user_images ui
      INNER JOIN user_image_likes uil ON ui.id = uil.image_id
      GROUP BY ui.id
    )
    UPDATE user_images
    SET is_trending = true
    WHERE id IN (
      SELECT id 
      FROM ranked_images 
      WHERE rank <= LEAST(200, total_images)
    );

    WITH ranked_images AS (
      SELECT 
        ui.id,
        COUNT(uil.id) as like_count,
        ROW_NUMBER() OVER (ORDER BY COUNT(uil.id) DESC) as rank
      FROM user_images ui
      INNER JOIN user_image_likes uil ON ui.id = uil.image_id
      GROUP BY ui.id
    )
    UPDATE user_images
    SET is_hot = true
    WHERE id IN (
      SELECT id 
      FROM ranked_images 
      WHERE rank <= LEAST(100, total_images)
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Schedule the trending/hot update function
SELECT cron.schedule(
  'update_trending_hot',
  '*/10 * * * *',
  $$SELECT update_trending_and_hot_status()$$
);

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_images_user_id ON public.user_images(user_id);
CREATE INDEX IF NOT EXISTS idx_user_images_privacy ON public.user_images(user_id, is_private);
CREATE INDEX IF NOT EXISTS idx_user_images_trending_hot ON public.user_images(is_trending, is_hot, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_image_likes_user_id ON public.user_image_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_image_likes_image_id ON public.user_image_likes(image_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);