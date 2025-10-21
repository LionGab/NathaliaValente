/*
  # ClubNath Notification Triggers

  This migration creates database triggers to automatically send notifications
  for key user interactions in the ClubNath app.

  ## Triggers Created:
  1. on_comment_created - New comment notifications
  2. on_like_created - New like notifications
  3. on_nathy_badge_created - Nathy badge notifications
  4. on_post_created - New post in category notifications

  ## Prerequisites:
  - HTTP extension must be enabled
  - Supabase URL and service role key must be configured
  - Notification system must be deployed
*/

-- ============================================================================
-- ENABLE HTTP EXTENSION
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS http;

-- ============================================================================
-- CONFIGURE SUPABASE SETTINGS
-- ============================================================================

-- Note: Replace these values with your actual Supabase project details
-- You can also set these using ALTER DATABASE or per-session:
--
-- ALTER DATABASE postgres SET app.settings.supabase_url TO 'https://your-project.supabase.co';
-- ALTER DATABASE postgres SET app.settings.service_role_key TO 'your-service-role-key';
--
-- Or set them in your session:
-- SET app.settings.supabase_url TO 'https://your-project.supabase.co';
-- SET app.settings.service_role_key TO 'your-service-role-key';

-- ============================================================================
-- HELPER FUNCTION: Send notification via HTTP
-- ============================================================================

CREATE OR REPLACE FUNCTION send_notification_http(
  p_user_id uuid,
  p_template_key text,
  p_template_data jsonb,
  p_priority text DEFAULT 'normal'
)
RETURNS void AS $$
DECLARE
  v_supabase_url text;
  v_service_role_key text;
BEGIN
  -- Get configuration
  v_supabase_url := current_setting('app.settings.supabase_url', true);
  v_service_role_key := current_setting('app.settings.service_role_key', true);

  -- If not configured, skip
  IF v_supabase_url IS NULL OR v_service_role_key IS NULL THEN
    RAISE NOTICE 'Supabase settings not configured, skipping notification';
    RETURN;
  END IF;

  -- Call Edge Function
  PERFORM http_post(
    v_supabase_url || '/functions/v1/send-notification',
    jsonb_build_object(
      'user_id', p_user_id,
      'template_key', p_template_key,
      'template_data', p_template_data,
      'priority', p_priority
    ),
    'application/json',
    jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || v_service_role_key
    )
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the transaction
    RAISE NOTICE 'Error sending notification: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGER 1: New Comment Notification
-- ============================================================================

CREATE OR REPLACE FUNCTION notify_new_comment()
RETURNS TRIGGER AS $$
DECLARE
  v_post_author_id uuid;
  v_commenter_name text;
  v_post_caption text;
  v_post_category text;
BEGIN
  -- Get post details
  SELECT user_id, caption, category
  INTO v_post_author_id, v_post_caption, v_post_category
  FROM posts
  WHERE id = NEW.post_id;

  -- Don't notify if commenting on own post
  IF v_post_author_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  -- Get commenter name
  SELECT full_name INTO v_commenter_name
  FROM profiles
  WHERE id = NEW.user_id;

  -- Send notification
  PERFORM send_notification_http(
    v_post_author_id,
    'new_comment',
    jsonb_build_object(
      'commenter_name', COALESCE(v_commenter_name, 'Alguém'),
      'comment_content', LEFT(NEW.content, 50),
      'post_id', NEW.post_id,
      'post_caption', LEFT(v_post_caption, 60),
      'post_category', v_post_category
    ),
    'normal'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_comment_created ON comments;
CREATE TRIGGER on_comment_created
  AFTER INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_comment();

-- ============================================================================
-- TRIGGER 2: New Like Notification
-- ============================================================================

CREATE OR REPLACE FUNCTION notify_new_like()
RETURNS TRIGGER AS $$
DECLARE
  v_post_author_id uuid;
  v_liker_name text;
  v_post_caption text;
  v_post_category text;
BEGIN
  -- Get post details
  SELECT user_id, caption, category
  INTO v_post_author_id, v_post_caption, v_post_category
  FROM posts
  WHERE id = NEW.post_id;

  -- Don't notify if liking own post
  IF v_post_author_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  -- Get liker name
  SELECT full_name INTO v_liker_name
  FROM profiles
  WHERE id = NEW.user_id;

  -- Send notification
  PERFORM send_notification_http(
    v_post_author_id,
    'new_like',
    jsonb_build_object(
      'liker_name', COALESCE(v_liker_name, 'Alguém'),
      'post_id', NEW.post_id,
      'post_caption', LEFT(v_post_caption, 60),
      'post_category', v_post_category
    ),
    'normal'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_like_created ON likes;
CREATE TRIGGER on_like_created
  AFTER INSERT ON likes
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_like();

-- ============================================================================
-- TRIGGER 3: Nathy Badge Notification
-- ============================================================================

CREATE OR REPLACE FUNCTION notify_nathy_badge()
RETURNS TRIGGER AS $$
DECLARE
  v_post_author_id uuid;
  v_post_caption text;
BEGIN
  -- Get post details
  SELECT user_id, caption
  INTO v_post_author_id, v_post_caption
  FROM posts
  WHERE id = NEW.post_id;

  -- Send high-priority notification
  PERFORM send_notification_http(
    v_post_author_id,
    'nathy_badge_received',
    jsonb_build_object(
      'post_id', NEW.post_id,
      'post_caption', LEFT(v_post_caption, 60)
    ),
    'high'  -- High priority to bypass quiet hours and rate limits
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_nathy_badge_created ON nathy_badges;
CREATE TRIGGER on_nathy_badge_created
  AFTER INSERT ON nathy_badges
  FOR EACH ROW
  EXECUTE FUNCTION notify_nathy_badge();

-- ============================================================================
-- TRIGGER 4: New Post in Category Notification
-- ============================================================================

CREATE OR REPLACE FUNCTION notify_new_post()
RETURNS TRIGGER AS $$
DECLARE
  v_author_name text;
  v_follower_id uuid;
BEGIN
  -- Get author name
  SELECT full_name INTO v_author_name
  FROM profiles
  WHERE id = NEW.user_id;

  -- Notify all users who follow this category
  -- This uses a cursor to avoid overwhelming the database
  FOR v_follower_id IN
    SELECT user_id
    FROM notification_preferences
    WHERE enable_new_content = true
      AND followed_categories @> ARRAY[NEW.category]
      AND user_id != NEW.user_id  -- Don't notify the author
    LIMIT 100  -- Limit to avoid too many notifications at once
  LOOP
    PERFORM send_notification_http(
      v_follower_id,
      'new_post_in_category',
      jsonb_build_object(
        'category_name', NEW.category,
        'author_name', COALESCE(v_author_name, 'Alguém'),
        'post_caption', LEFT(NEW.caption, 80),
        'post_id', NEW.id
      ),
      'low'  -- Low priority for content discovery
    );
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_post_created ON posts;
CREATE TRIGGER on_post_created
  AFTER INSERT ON posts
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_post();

-- ============================================================================
-- OPTIONAL: Robô Nath Response Notification
-- ============================================================================

CREATE OR REPLACE FUNCTION notify_robo_nath_response()
RETURNS TRIGGER AS $$
BEGIN
  -- Only notify for AI responses (is_user = false)
  IF NEW.is_user = false THEN
    PERFORM send_notification_http(
      NEW.user_id,
      'robo_nath_response',
      jsonb_build_object(
        'message_preview', LEFT(NEW.message, 50)
      ),
      'normal'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger (optional - you may want to disable this)
DROP TRIGGER IF EXISTS on_robo_nath_response ON chat_messages;
CREATE TRIGGER on_robo_nath_response
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_robo_nath_response();

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check if HTTP extension is enabled
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'http') THEN
    RAISE NOTICE 'HTTP extension is NOT enabled. Enable it with: CREATE EXTENSION http;';
  ELSE
    RAISE NOTICE 'HTTP extension is enabled ✓';
  END IF;
END $$;

-- List all notification triggers
DO $$
DECLARE
  v_trigger RECORD;
BEGIN
  RAISE NOTICE 'Notification triggers installed:';
  FOR v_trigger IN
    SELECT tgname, tgrelid::regclass as table_name
    FROM pg_trigger
    WHERE tgname LIKE 'on_%'
      AND tgname IN ('on_comment_created', 'on_like_created', 'on_nathy_badge_created', 'on_post_created', 'on_robo_nath_response')
  LOOP
    RAISE NOTICE '  ✓ % on %', v_trigger.tgname, v_trigger.table_name;
  END LOOP;
END $$;

-- ============================================================================
-- USAGE INSTRUCTIONS
-- ============================================================================

/*
  After running this migration, you need to configure the Supabase settings:

  1. Using ALTER DATABASE (recommended for production):

     ALTER DATABASE postgres
       SET app.settings.supabase_url TO 'https://your-project.supabase.co';

     ALTER DATABASE postgres
       SET app.settings.service_role_key TO 'your-service-role-key';

  2. Or using per-session settings (for testing):

     SET app.settings.supabase_url TO 'https://your-project.supabase.co';
     SET app.settings.service_role_key TO 'your-service-role-key';

  3. Verify configuration:

     SELECT current_setting('app.settings.supabase_url', true);
     SELECT current_setting('app.settings.service_role_key', true);

  4. Test a trigger manually:

     -- Create a test comment to trigger notification
     INSERT INTO comments (post_id, user_id, content)
     VALUES ('existing-post-id', 'different-user-id', 'Test comment');

     -- Check notification_history table
     SELECT * FROM notification_history
     ORDER BY created_at DESC LIMIT 5;

  5. Monitor notifications:

     -- View recent notifications
     SELECT
       id,
       user_id,
       template_key,
       title,
       status,
       created_at
     FROM notification_history
     ORDER BY created_at DESC
     LIMIT 10;

  6. Disable a trigger if needed:

     ALTER TABLE comments DISABLE TRIGGER on_comment_created;

  7. Re-enable a trigger:

     ALTER TABLE comments ENABLE TRIGGER on_comment_created;
*/
