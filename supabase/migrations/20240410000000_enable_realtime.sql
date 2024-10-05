-- Enable real-time for user_images table
ALTER PUBLICATION supabase_realtime ADD TABLE user_images;

-- Enable real-time for image_generation_queue table
ALTER PUBLICATION supabase_realtime ADD TABLE image_generation_queue;

-- Enable real-time for huggingface_api_keys table
ALTER PUBLICATION supabase_realtime ADD TABLE huggingface_api_keys;