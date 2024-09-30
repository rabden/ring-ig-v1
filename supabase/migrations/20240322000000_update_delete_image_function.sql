-- Drop the existing function and trigger
DROP TRIGGER IF EXISTS delete_image_trigger ON user_images;
DROP FUNCTION IF EXISTS delete_image_from_storage();

-- Create an updated function to delete image from storage
CREATE OR REPLACE FUNCTION delete_image_from_storage()
RETURNS TRIGGER AS $$
DECLARE
  image_path TEXT;
BEGIN
  -- Extract the path from the full URL
  image_path := regexp_replace(OLD.image_url, '^https?://[^/]+/storage/v1/object/public/', '');
  
  -- Use the correct method to delete from storage
  PERFORM storage.delete('user-images', image_path);
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER delete_image_trigger
BEFORE DELETE ON user_images
FOR EACH ROW
EXECUTE FUNCTION delete_image_from_storage();