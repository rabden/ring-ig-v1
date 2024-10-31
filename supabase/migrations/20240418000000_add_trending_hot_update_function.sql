-- Function to update trending and hot status based on likes count
CREATE OR REPLACE FUNCTION update_trending_and_hot_status()
RETURNS void AS $$
BEGIN
  -- First, reset all trending and hot status
  UPDATE user_images
  SET is_trending = false,
      is_hot = false;

  -- Update trending status for top 200 liked images
  WITH top_trending AS (
    SELECT DISTINCT ui.id
    FROM user_images ui
    LEFT JOIN user_image_likes uil ON ui.id = uil.image_id
    GROUP BY ui.id
    ORDER BY COUNT(uil.id) DESC
    LIMIT 200
  )
  UPDATE user_images
  SET is_trending = true
  WHERE id IN (SELECT id FROM top_trending);

  -- Update hot status for top 100 liked images
  WITH top_hot AS (
    SELECT DISTINCT ui.id
    FROM user_images ui
    LEFT JOIN user_image_likes uil ON ui.id = uil.image_id
    GROUP BY ui.id
    ORDER BY COUNT(uil.id) DESC
    LIMIT 100
  )
  UPDATE user_images
  SET is_hot = true
  WHERE id IN (SELECT id FROM top_hot);
END;
$$ LANGUAGE plpgsql;

-- Create a cron job to run the function every hour
SELECT cron.schedule(
  'update_trending_hot',  -- job name
  '0 * * * *',           -- every hour
  'SELECT update_trending_and_hot_status()'
);