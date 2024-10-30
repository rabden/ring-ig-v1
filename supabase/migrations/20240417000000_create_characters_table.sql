-- Create characters table
CREATE TABLE IF NOT EXISTS public.characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    character_name TEXT NOT NULL,
    description TEXT NOT NULL,
    age INTEGER NOT NULL,
    character_id INTEGER NOT NULL, -- This will be used as the seed
    eyes_shape TEXT NOT NULL,
    eyes_color TEXT NOT NULL,
    nose_shape TEXT NOT NULL,
    hair_type TEXT NOT NULL,
    hair_color TEXT NOT NULL,
    hair_length TEXT NOT NULL,
    height TEXT NOT NULL,
    cultural_accent TEXT NOT NULL,
    gender TEXT NOT NULL,
    personality TEXT NOT NULL,
    face_shape TEXT NOT NULL,
    body_color TEXT NOT NULL,
    body_shape TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON public.characters(user_id);

-- Enable RLS
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own characters" ON public.characters
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own characters" ON public.characters
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own characters" ON public.characters
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own characters" ON public.characters
    FOR DELETE USING (auth.uid() = user_id);