-- Enable real-time for user_images table
ALTER PUBLICATION supabase_realtime ADD TABLE user_images;

-- Enable real-time for user_image_likes table
ALTER PUBLICATION supabase_realtime ADD TABLE user_image_likes;

-- Enable real-time for model_configs table
ALTER PUBLICATION supabase_realtime ADD TABLE model_configs;

-- Enable real-time for style_configs table
ALTER PUBLICATION supabase_realtime ADD TABLE style_configs;

-- Enable real-time for user_credits table
ALTER PUBLICATION supabase_realtime ADD TABLE user_credits;