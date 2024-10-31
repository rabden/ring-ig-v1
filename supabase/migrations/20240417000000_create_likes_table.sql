-- Drop existing table if it exists
DROP TABLE IF EXISTS public.user_image_likes;

-- Create likes table
CREATE TABLE IF NOT EXISTS public.user_image_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    image_id UUID REFERENCES public.user_images(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, image_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_image_likes_user_id ON public.user_image_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_image_likes_image_id ON public.user_image_likes(image_id);
CREATE INDEX IF NOT EXISTS idx_user_image_likes_created_by ON public.user_image_likes(created_by);

-- Enable RLS
ALTER TABLE public.user_image_likes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own likes"
    ON public.user_image_likes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
    ON public.user_image_likes
    FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view likes"
    ON public.user_image_likes
    FOR SELECT
    USING (true);