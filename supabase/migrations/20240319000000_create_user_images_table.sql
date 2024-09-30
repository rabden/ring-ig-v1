-- Create the user_images table
CREATE TABLE IF NOT EXISTS user_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    prompt TEXT NOT NULL,
    model TEXT NOT NULL,
    seed INTEGER NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    steps INTEGER NOT NULL,
    quality TEXT NOT NULL,
    aspect_ratio TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_user_images_user_id ON user_images(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_images ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to see only their own images
CREATE POLICY user_images_policy ON user_images
    FOR ALL
    USING (auth.uid() = user_id);

-- Create a function to automatically delete old images from storage when deleting from the table
CREATE OR REPLACE FUNCTION delete_image_from_storage()
RETURNS TRIGGER AS $$
BEGIN
    -- Assuming the bucket name is 'user-images'
    PERFORM storage.delete('user-images', OLD.image_url);
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a row is deleted
CREATE TRIGGER delete_image_trigger
BEFORE DELETE ON user_images
FOR EACH ROW
EXECUTE FUNCTION delete_image_from_storage();