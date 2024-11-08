-- Add hidden_by column to global_notifications table
ALTER TABLE public.global_notifications
ADD COLUMN hidden_by TEXT DEFAULT '';

-- Add comment to document hidden_by format
COMMENT ON COLUMN public.global_notifications.hidden_by IS 'Comma-separated list of user IDs who have hidden this notification';

-- Migrate existing hidden notifications from profiles
DO $$
DECLARE
    profile_record RECORD;
    notification_id TEXT;
    user_id UUID;
BEGIN
    FOR profile_record IN 
        SELECT id, hidden_global_notifications 
        FROM profiles 
        WHERE hidden_global_notifications IS NOT NULL 
        AND hidden_global_notifications != ''
    LOOP
        FOR notification_id IN 
            SELECT unnest(string_to_array(profile_record.hidden_global_notifications, ','))
        LOOP
            -- Update the hidden_by field for each notification
            UPDATE global_notifications 
            SET hidden_by = CASE
                WHEN hidden_by = '' THEN profile_record.id::TEXT
                ELSE hidden_by || ',' || profile_record.id::TEXT
            END
            WHERE id::TEXT = notification_id;
        END LOOP;
    END LOOP;
END $$;

-- Remove hidden_global_notifications column from profiles as it's no longer needed
ALTER TABLE public.profiles
DROP COLUMN hidden_global_notifications;