-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-images', 'user-images', true);

CREATE POLICY "User Images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-images');

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'user-images' AND
  auth.uid() = owner
);

CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'user-images' AND
  auth.uid() = owner
);

-- Create profiles table
CREATE TABLE public.profiles (
    id uuid NOT NULL,
    display_name text,
    avatar_url text,
    updated_at timestamp with time zone DEFAULT current_timestamp,
    is_pro boolean DEFAULT false,
    is_pro_request boolean DEFAULT false,
    credit_count integer NOT NULL DEFAULT 50,
    bonus_credits integer NOT NULL DEFAULT 0,
    last_refill_time timestamp with time zone DEFAULT current_timestamp,
    is_admin boolean DEFAULT false,
    followers_count integer DEFAULT 0,
    following_count integer DEFAULT 0,
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create user_images table
CREATE TABLE public.user_images (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid,
    storage_path text NOT NULL,
    prompt text NOT NULL,
    model text NOT NULL,
    seed integer NOT NULL,
    width integer NOT NULL,
    height integer NOT NULL,
    quality text NOT NULL,
    aspect_ratio text NOT NULL,
    created_at timestamp with time zone DEFAULT current_timestamp,
    is_trending boolean NOT NULL DEFAULT false,
    is_hot boolean NOT NULL DEFAULT false,
    is_private boolean NOT NULL DEFAULT false,
    metadata jsonb DEFAULT '{}'::jsonb,
    generation_id uuid,
    CONSTRAINT user_images_pkey PRIMARY KEY (id),
    CONSTRAINT user_images_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create generation_queue table
CREATE TABLE public.generation_queue (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    prompt text NOT NULL,
    model text NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT current_timestamp,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    github_run_id text,
    github_run_number integer,
    parameters jsonb NOT NULL DEFAULT '{}'::jsonb,
    result_url text,
    error text,
    retry_count integer DEFAULT 0,
    last_error text,
    last_retry_at timestamp with time zone,
    width integer,
    height integer,
    is_public boolean DEFAULT true,
    is_nsfw boolean DEFAULT false,
    priority integer DEFAULT 0,
    seed integer,
    quality text,
    aspect_ratio text,
    CONSTRAINT generation_queue_pkey PRIMARY KEY (id),
    CONSTRAINT generation_queue_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT generation_queue_status_check CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

-- Create user_image_likes table
CREATE TABLE public.user_image_likes (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid,
    image_id uuid,
    created_by uuid,
    created_at timestamp with time zone DEFAULT current_timestamp,
    CONSTRAINT user_image_likes_pkey PRIMARY KEY (id),
    CONSTRAINT user_image_likes_user_id_image_id_key UNIQUE (user_id, image_id),
    CONSTRAINT user_image_likes_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT user_image_likes_image_id_fkey FOREIGN KEY (image_id) REFERENCES user_images(id) ON DELETE CASCADE,
    CONSTRAINT user_image_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create user_follows table
CREATE TABLE public.user_follows (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    follower_id uuid NOT NULL,
    following_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT current_timestamp,
    CONSTRAINT user_follows_pkey PRIMARY KEY (id),
    CONSTRAINT user_follows_follower_id_following_id_key UNIQUE (follower_id, following_id),
    CONSTRAINT user_follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES profiles(id) ON DELETE CASCADE,
    CONSTRAINT user_follows_following_id_fkey FOREIGN KEY (following_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create notifications table
CREATE TABLE public.notifications (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid,
    title text NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT current_timestamp,
    link text,
    image_url text,
    link_names text,
    CONSTRAINT notifications_pkey PRIMARY KEY (id),
    CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create huggingface_api_keys table
CREATE TABLE public.huggingface_api_keys (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    api_key text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT current_timestamp,
    last_used_at timestamp with time zone,
    usage_count integer DEFAULT 0,
    error_count integer DEFAULT 0,
    last_error text,
    CONSTRAINT huggingface_api_keys_pkey PRIMARY KEY (id),
    CONSTRAINT huggingface_api_keys_api_key_key UNIQUE (api_key)
);

-- Create indexes
CREATE INDEX idx_user_images_user_id ON public.user_images USING btree (user_id);
CREATE INDEX idx_user_images_privacy ON public.user_images USING btree (user_id, is_private);
CREATE INDEX idx_user_images_generation ON public.user_images USING btree (generation_id);
CREATE INDEX idx_user_image_likes_user_id ON public.user_image_likes USING btree (user_id);
CREATE INDEX idx_user_image_likes_image_id ON public.user_image_likes USING btree (image_id);
CREATE INDEX idx_user_image_likes_created_by ON public.user_image_likes USING btree (created_by);
CREATE INDEX idx_user_follows_follower ON public.user_follows USING btree (follower_id);
CREATE INDEX idx_user_follows_following ON public.user_follows USING btree (following_id);
CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);
CREATE INDEX idx_huggingface_api_keys_is_active ON public.huggingface_api_keys USING btree (is_active);
CREATE INDEX idx_generation_queue_status ON public.generation_queue USING btree (status);
CREATE INDEX idx_generation_queue_user ON public.generation_queue USING btree (user_id);
CREATE INDEX idx_generation_queue_created ON public.generation_queue USING btree (created_at);

-- Create functions
CREATE OR REPLACE FUNCTION public.update_follow_counts()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles
    SET following_count = following_count + 1
    WHERE id = NEW.follower_id;
    
    UPDATE public.profiles
    SET followers_count = followers_count + 1
    WHERE id = NEW.following_id;
    
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles
    SET following_count = GREATEST(0, following_count - 1)
    WHERE id = OLD.follower_id;
    
    UPDATE public.profiles
    SET followers_count = GREATEST(0, followers_count - 1)
    WHERE id = OLD.following_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create credit usage function
CREATE OR REPLACE FUNCTION public.handle_credit_usage()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'processing' AND OLD.status = 'pending' THEN
    UPDATE public.profiles
    SET credit_count = GREATEST(0, credit_count - 1)
    WHERE id = NEW.user_id
    AND credit_count > 0;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create API key rotation function
CREATE OR REPLACE FUNCTION public.get_next_api_key()
RETURNS text AS $$
DECLARE
  next_key text;
BEGIN
  UPDATE public.huggingface_api_keys
  SET last_used_at = NOW(),
      usage_count = usage_count + 1
  WHERE id = (
    SELECT id
    FROM public.huggingface_api_keys
    WHERE is_active = true
    ORDER BY last_used_at ASC NULLS FIRST
    LIMIT 1
  )
  RETURNING api_key INTO next_key;
  
  RETURN next_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER on_follow_changed
AFTER INSERT OR DELETE ON public.user_follows
FOR EACH ROW
EXECUTE FUNCTION update_follow_counts();

CREATE TRIGGER on_generation_start
AFTER UPDATE ON public.generation_queue
FOR EACH ROW
WHEN (NEW.status = 'processing' AND OLD.status = 'pending')
EXECUTE FUNCTION handle_credit_usage();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_image_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.huggingface_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Public images are viewable by everyone"
ON public.user_images FOR SELECT
USING (NOT is_private OR auth.uid() = user_id);

CREATE POLICY "Users can insert own images"
ON public.user_images FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own images"
ON public.user_images FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own images"
ON public.user_images FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Image likes are viewable by everyone"
ON public.user_image_likes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can like images"
ON public.user_image_likes FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can remove own likes"
ON public.user_image_likes FOR DELETE
USING (auth.uid() = created_by);

CREATE POLICY "Follows are viewable by everyone"
ON public.user_follows FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can follow others"
ON public.user_follows FOR INSERT
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
ON public.user_follows FOR DELETE
USING (auth.uid() = follower_id);

CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
ON public.notifications FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can access API keys"
ON public.huggingface_api_keys FOR ALL
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = true));

CREATE POLICY "Users can view own queue items"
ON public.generation_queue FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own queue items"
ON public.generation_queue FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update any queue item"
ON public.generation_queue FOR UPDATE
USING (true)
WITH CHECK (true);

-- Enable realtime
CREATE PUBLICATION supabase_realtime;

ALTER PUBLICATION supabase_realtime ADD TABLE public.user_images;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_image_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_follows;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.generation_queue;

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, authenticated; 