/*
  # ClubNath Notifications System

  This migration creates the complete notification infrastructure for personalized push notifications.

  ## Tables
  1. notification_preferences - User notification settings
  2. notification_templates - Reusable notification templates with variables
  3. notification_history - Log of all sent notifications
  4. push_tokens - Device tokens for push notifications
  5. notification_schedule - Scheduled notifications

  ## Security
  - RLS enabled on all tables
  - Users can only manage their own preferences and tokens
  - Notification history is readable by recipients
  - Templates are readable by all authenticated users
*/

-- ============================================================================
-- NOTIFICATION PREFERENCES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Notification Type Toggles
  enable_push boolean DEFAULT true,
  enable_email boolean DEFAULT true,
  enable_in_app boolean DEFAULT true,

  -- Category Preferences
  enable_community_activity boolean DEFAULT true,  -- Comments, likes on user's posts
  enable_new_content boolean DEFAULT true,         -- New posts in followed categories
  enable_daily_encouragement boolean DEFAULT true, -- Daily motivational messages
  enable_habit_reminders boolean DEFAULT true,     -- Journaling/emotion tracking reminders
  enable_chat_responses boolean DEFAULT true,      -- Robô Nath responses
  enable_badges boolean DEFAULT true,              -- Nathy badge notifications

  -- Timing Preferences
  quiet_hours_start time,                          -- e.g., '22:00:00'
  quiet_hours_end time,                            -- e.g., '07:00:00'
  preferred_time_morning time DEFAULT '08:00:00',  -- For morning encouragement
  preferred_time_evening time DEFAULT '20:00:00',  -- For evening reflection
  timezone text DEFAULT 'America/Sao_Paulo',

  -- Frequency Controls (rate limiting per category)
  max_community_per_day integer DEFAULT 10,
  max_content_per_day integer DEFAULT 5,
  max_reminders_per_day integer DEFAULT 3,

  -- Followed Categories for Content Notifications
  followed_categories text[] DEFAULT ARRAY['Look do dia', 'Desabafo', 'Fé', 'Dica de mãe'],

  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(user_id)
);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notification preferences"
  ON notification_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notification preferences"
  ON notification_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences"
  ON notification_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- PUSH TOKENS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS push_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  token text NOT NULL,                    -- FCM/OneSignal/Web Push token
  platform text NOT NULL,                 -- 'ios', 'android', 'web'
  device_name text,                       -- Optional device identifier

  is_active boolean DEFAULT true,         -- For disabling without deleting
  last_used_at timestamptz DEFAULT now(), -- Track token freshness

  created_at timestamptz DEFAULT now(),

  UNIQUE(token)
);

ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own push tokens"
  ON push_tokens FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own push tokens"
  ON push_tokens FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own push tokens"
  ON push_tokens FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own push tokens"
  ON push_tokens FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_push_tokens_user_id ON push_tokens(user_id);
CREATE INDEX idx_push_tokens_active ON push_tokens(is_active) WHERE is_active = true;

-- ============================================================================
-- NOTIFICATION TEMPLATES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notification_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  template_key text NOT NULL UNIQUE,      -- e.g., 'new_comment', 'daily_encouragement'
  category text NOT NULL,                 -- Maps to preference categories

  -- Template Content (supports variables like {{user_name}}, {{post_caption}})
  title_template text NOT NULL,
  body_template text NOT NULL,

  -- Localization (default: pt-BR)
  language text DEFAULT 'pt-BR',

  -- Priority and delivery
  priority text DEFAULT 'normal',         -- 'high', 'normal', 'low'
  ttl_seconds integer DEFAULT 86400,      -- Time to live (default 24h)

  -- Optional deep link pattern
  deep_link_pattern text,                 -- e.g., '/post/{{post_id}}'

  -- Metadata
  description text,                       -- For documentation
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are viewable by authenticated users"
  ON notification_templates FOR SELECT
  TO authenticated
  USING (true);

-- Insert default templates
INSERT INTO notification_templates (template_key, category, title_template, body_template, description, deep_link_pattern)
VALUES
  -- Community Activity Notifications
  (
    'new_comment',
    'community_activity',
    'Novo comentário em seu post',
    '{{commenter_name}} comentou: "{{comment_content}}"',
    'When someone comments on user''s post',
    '/post/{{post_id}}'
  ),
  (
    'new_like',
    'community_activity',
    '{{liker_name}} curtiu seu post',
    'Seu post sobre {{post_category}} está fazendo sucesso! ❤️',
    'When someone likes user''s post',
    '/post/{{post_id}}'
  ),
  (
    'nathy_badge_received',
    'badges',
    'Parabéns! Você recebeu um selo Nathy! 🏆',
    'Seu post "{{post_caption}}" foi reconhecido pela comunidade!',
    'When a post receives a Nathy badge',
    '/post/{{post_id}}'
  ),

  -- Daily Encouragement
  (
    'morning_encouragement',
    'daily_encouragement',
    'Bom dia, mãe guerreira! ☀️',
    '{{quote_content}} - {{quote_author}}',
    'Morning motivational message',
    '/daily-quote'
  ),
  (
    'evening_reflection',
    'daily_encouragement',
    'Momento de reflexão 🌙',
    '{{reflection_content}}',
    'Evening reflection message',
    '/daily-quote'
  ),

  -- Habit Reminders
  (
    'journal_reminder',
    'habit_reminders',
    'Hora de registrar suas emoções 📝',
    'Como você está se sentindo hoje? Reserve um momento para você.',
    'Reminder to journal emotions',
    '/journal'
  ),
  (
    'self_care_reminder',
    'habit_reminders',
    'Você merece um momento para você 💆‍♀️',
    'Já fez algo especial por você hoje? Lembre-se: cuidar de si também é importante!',
    'Self-care reminder',
    '/self-care'
  ),

  -- New Content
  (
    'new_post_in_category',
    'new_content',
    'Novo post em {{category_name}}',
    '{{author_name}} compartilhou: "{{post_caption}}"',
    'New post in followed category',
    '/post/{{post_id}}'
  ),
  (
    'trending_post',
    'new_content',
    'Post em alta na comunidade 🔥',
    'Não perca: "{{post_caption}}" por {{author_name}}',
    'Trending posts in the community',
    '/post/{{post_id}}'
  ),

  -- Chat/AI Responses
  (
    'robo_nath_response',
    'chat_responses',
    'Robô Nath respondeu você 💬',
    'Tenho algo especial para compartilhar com você!',
    'AI assistant response notification',
    '/chat'
  )
ON CONFLICT (template_key) DO NOTHING;

-- ============================================================================
-- NOTIFICATION HISTORY TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notification_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  template_key text REFERENCES notification_templates(template_key),

  -- Notification Content
  title text NOT NULL,
  body text NOT NULL,
  deep_link text,

  -- Delivery Details
  status text NOT NULL DEFAULT 'pending',  -- 'pending', 'sent', 'failed', 'read'
  delivery_method text NOT NULL,           -- 'push', 'email', 'in_app'

  -- Metadata
  data jsonb,                              -- Additional data (post_id, comment_id, etc.)
  error_message text,                      -- If delivery failed

  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz DEFAULT now(),

  -- Rate limiting index
  rate_limit_key text                      -- Format: 'user_id:category:date'
);

ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notification history"
  ON notification_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_notification_history_user_id ON notification_history(user_id);
CREATE INDEX idx_notification_history_status ON notification_history(status);
CREATE INDEX idx_notification_history_created_at ON notification_history(created_at DESC);
CREATE INDEX idx_notification_history_rate_limit ON notification_history(rate_limit_key, created_at);

-- ============================================================================
-- NOTIFICATION SCHEDULE TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notification_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  template_key text NOT NULL REFERENCES notification_templates(template_key),

  -- Schedule Configuration
  scheduled_for timestamptz NOT NULL,
  recurrence text,                         -- 'daily', 'weekly', 'monthly', null for one-time

  -- Template Variables
  template_data jsonb DEFAULT '{}',        -- Variables to populate template

  -- Status
  status text DEFAULT 'pending',           -- 'pending', 'sent', 'cancelled'
  sent_at timestamptz,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE notification_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own scheduled notifications"
  ON notification_schedule FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_notification_schedule_pending ON notification_schedule(scheduled_for)
  WHERE status = 'pending';

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to check if user is in quiet hours
CREATE OR REPLACE FUNCTION is_in_quiet_hours(
  p_user_id uuid,
  p_check_time timestamptz DEFAULT now()
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_quiet_start time;
  v_quiet_end time;
  v_user_time time;
BEGIN
  -- Get user's quiet hours
  SELECT quiet_hours_start, quiet_hours_end
  INTO v_quiet_start, v_quiet_end
  FROM notification_preferences
  WHERE user_id = p_user_id;

  -- If no quiet hours set, return false
  IF v_quiet_start IS NULL OR v_quiet_end IS NULL THEN
    RETURN false;
  END IF;

  -- Convert check time to user's local time
  v_user_time := p_check_time::time;

  -- Check if time falls within quiet hours
  IF v_quiet_start < v_quiet_end THEN
    -- Normal case: 22:00 - 07:00 next day
    RETURN v_user_time >= v_quiet_start OR v_user_time < v_quiet_end;
  ELSE
    -- Overnight case: 22:00 - 07:00
    RETURN v_user_time >= v_quiet_start AND v_user_time < v_quiet_end;
  END IF;
END;
$$;

-- Function to check rate limits
CREATE OR REPLACE FUNCTION check_notification_rate_limit(
  p_user_id uuid,
  p_category text,
  p_max_per_day integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count integer;
  v_rate_key text;
BEGIN
  -- Generate rate limit key
  v_rate_key := p_user_id || ':' || p_category || ':' || CURRENT_DATE;

  -- Count notifications sent today in this category
  SELECT COUNT(*)
  INTO v_count
  FROM notification_history
  WHERE rate_limit_key = v_rate_key
    AND created_at >= CURRENT_DATE
    AND status = 'sent';

  -- Return true if under limit
  RETURN v_count < p_max_per_day;
END;
$$;

-- Function to create default notification preferences for new users
CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Trigger to auto-create notification preferences for new users
DROP TRIGGER IF EXISTS on_user_created_notification_prefs ON profiles;
CREATE TRIGGER on_user_created_notification_prefs
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_notification_preferences();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_notification_preferences_updated_at ON notification_preferences;
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notification_templates_updated_at ON notification_templates;
CREATE TRIGGER update_notification_templates_updated_at
  BEFORE UPDATE ON notification_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notification_schedule_updated_at ON notification_schedule;
CREATE TRIGGER update_notification_schedule_updated_at
  BEFORE UPDATE ON notification_schedule
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS FOR ANALYTICS
-- ============================================================================

-- View for notification analytics per user
CREATE OR REPLACE VIEW notification_analytics AS
SELECT
  user_id,
  delivery_method,
  status,
  DATE(created_at) as notification_date,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE read_at IS NOT NULL) as read_count,
  AVG(EXTRACT(EPOCH FROM (read_at - sent_at))) as avg_time_to_read_seconds
FROM notification_history
GROUP BY user_id, delivery_method, status, DATE(created_at);

COMMENT ON VIEW notification_analytics IS 'Analytics view for notification delivery and engagement metrics';
