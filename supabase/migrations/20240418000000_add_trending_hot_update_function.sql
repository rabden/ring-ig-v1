-- Function to update trending and hot status based on likes count
CREATE OR REPLACE FUNCTION update_trending_and_hot_status()
RETURNS void AS $$
DECLARE
  total_images INTEGER;
BEGIN
  -- Get total number of images with likes
  SELECT COUNT(DISTINCT ui.id)
  INTO total_images
  FROM user_images ui
  INNER JOIN user_image_likes uil ON ui.id = uil.image_id;

  -- First, reset all trending and hot status
  UPDATE user_images
  SET is_trending = false,
      is_hot = false;

  -- Only proceed if there are any liked images
  IF total_images > 0 THEN
    -- Update trending status for top 200 liked images (or all if less than 200)
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

    -- Update hot status for top 100 liked images (or all if less than 100)
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

-- Drop existing schedule if it exists
SELECT cron.unschedule('update_trending_hot');

-- Create a cron job to run the function every 10 minutes
SELECT cron.schedule(
  'update_trending_hot',  -- job name
  '*/10 * * * *',        -- every 10 minutes
  'SELECT update_trending_and_hot_status()'
);