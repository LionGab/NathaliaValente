/*
  Emotional Intelligence System Migration

  This migration adds tables and functions for the emotional intelligence system
  that personalizes habit notifications based on user's emotional diary entries.

  Features:
  - Diary entries with emotion detection
  - Emotional pattern tracking
  - Notification preferences with AI adjustments
  - Habit reminders with emotional awareness
  - Support resources and escalation
  - Privacy-first design with encryption support
*/

-- ============================================
-- 1. DIARY ENTRIES
-- ============================================

CREATE TABLE IF NOT EXISTS diary_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  content_encrypted text,
  detected_emotions jsonb DEFAULT '[]'::jsonb,
  primary_emotion text,
  emotion_confidence decimal(3,2),
  sentiment_score decimal(3,2),
  emojis text[],
  user_emotion_tag text,
  mood_intensity integer CHECK (mood_intensity >= 1 AND mood_intensity <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- Indexes
CREATE INDEX idx_diary_entries_user_id ON diary_entries(user_id);
CREATE INDEX idx_diary_entries_created_at ON diary_entries(created_at DESC);
CREATE INDEX idx_diary_entries_primary_emotion ON diary_entries(primary_emotion);
CREATE INDEX idx_diary_entries_user_created ON diary_entries(user_id, created_at DESC);
CREATE INDEX idx_diary_entries_sentiment ON diary_entries(sentiment_score);

-- RLS Policies
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own diary entries"
  ON diary_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can create diary entries"
  ON diary_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diary entries"
  ON diary_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 2. EMOTIONAL PATTERNS
-- ============================================

CREATE TABLE IF NOT EXISTS emotional_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  period_type text NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly')),
  dominant_emotions jsonb DEFAULT '[]'::jsonb,
  average_sentiment decimal(3,2),
  mood_volatility decimal(3,2),
  morning_sentiment decimal(3,2),
  afternoon_sentiment decimal(3,2),
  evening_sentiment decimal(3,2),
  stress_level integer CHECK (stress_level >= 1 AND stress_level <= 5),
  overwhelm_score decimal(3,2),
  gratitude_count integer DEFAULT 0,
  joy_count integer DEFAULT 0,
  entry_count integer DEFAULT 0,
  computed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_emotional_patterns_user_id ON emotional_patterns(user_id);
CREATE INDEX idx_emotional_patterns_period ON emotional_patterns(user_id, period_start DESC);
CREATE UNIQUE INDEX idx_emotional_patterns_unique ON emotional_patterns(user_id, period_start, period_type);

-- RLS Policies
ALTER TABLE emotional_patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own emotional patterns"
  ON emotional_patterns FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- 3. NOTIFICATION PREFERENCES
-- ============================================

CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ai_adjustment_enabled boolean DEFAULT true,
  preferred_times integer[] DEFAULT ARRAY[9, 14, 19],
  blackout_start time,
  blackout_end time,
  max_daily_notifications integer DEFAULT 3,
  min_notification_interval_hours integer DEFAULT 4,
  preferred_tone text DEFAULT 'balanced' CHECK (preferred_tone IN ('gentle', 'balanced', 'motivational', 'calming', 'warm', 'enthusiastic')),
  enable_support_resources boolean DEFAULT true,
  store_diary_content boolean DEFAULT true,
  encryption_enabled boolean DEFAULT true,
  avoid_morning_notifications boolean DEFAULT false,
  reduce_frequency_on_stress boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Unique constraint
CREATE UNIQUE INDEX idx_notification_preferences_user ON notification_preferences(user_id);

-- RLS Policies
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification preferences"
  ON notification_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification preferences"
  ON notification_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences"
  ON notification_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 4. HABIT REMINDERS
-- ============================================

CREATE TABLE IF NOT EXISTS habit_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  scheduled_time time NOT NULL,
  frequency text DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'custom')),
  days_of_week integer[],
  adjust_for_emotions boolean DEFAULT true,
  skip_on_negative_mood boolean DEFAULT false,
  is_active boolean DEFAULT true,
  last_sent_at timestamptz,
  next_scheduled_at timestamptz,
  completed_count integer DEFAULT 0,
  skipped_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_habit_reminders_user_id ON habit_reminders(user_id);
CREATE INDEX idx_habit_reminders_next_scheduled ON habit_reminders(next_scheduled_at) WHERE is_active = true;
CREATE INDEX idx_habit_reminders_user_active ON habit_reminders(user_id, is_active);

-- RLS Policies
ALTER TABLE habit_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own habit reminders"
  ON habit_reminders FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 5. NOTIFICATION HISTORY
-- ============================================

CREATE TABLE IF NOT EXISTS notification_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  habit_reminder_id uuid REFERENCES habit_reminders(id) ON DELETE SET NULL,
  title text NOT NULL,
  message text NOT NULL,
  notification_type text NOT NULL CHECK (notification_type IN ('habit', 'support', 'quote', 'check_in')),
  user_emotional_state jsonb,
  adjustment_applied text,
  delivered boolean DEFAULT false,
  opened boolean DEFAULT false,
  action_taken boolean DEFAULT false,
  dismissed boolean DEFAULT false,
  scheduled_for timestamptz NOT NULL,
  sent_at timestamptz,
  opened_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_notification_history_user_id ON notification_history(user_id);
CREATE INDEX idx_notification_history_sent_at ON notification_history(sent_at DESC);
CREATE INDEX idx_notification_history_user_sent ON notification_history(user_id, sent_at DESC);
CREATE INDEX idx_notification_history_engagement ON notification_history(user_id, opened, action_taken);

-- RLS Policies
ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification history"
  ON notification_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update notification engagement"
  ON notification_history FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 6. SUPPORT RESOURCES
-- ============================================

CREATE TABLE IF NOT EXISTS support_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  resource_type text NOT NULL CHECK (resource_type IN ('article', 'hotline', 'therapist_finder', 'meditation', 'exercise')),
  url text,
  phone_number text,
  trigger_emotions text[],
  trigger_stress_level integer CHECK (trigger_stress_level >= 1 AND trigger_stress_level <= 5),
  locale text DEFAULT 'pt-BR',
  is_active boolean DEFAULT true,
  priority integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_support_resources_active ON support_resources(is_active, priority DESC);
CREATE INDEX idx_support_resources_type ON support_resources(resource_type);
CREATE INDEX idx_support_resources_locale ON support_resources(locale);

-- RLS Policies
ALTER TABLE support_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Support resources are viewable by everyone"
  ON support_resources FOR SELECT
  TO authenticated
  USING (is_active = true);

-- ============================================
-- 7. HELPER FUNCTIONS
-- ============================================

-- Function to get recent diary entries with emotional context
CREATE OR REPLACE FUNCTION get_user_emotional_context(
  p_user_id uuid,
  p_days integer DEFAULT 7
)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT jsonb_build_object(
    'recent_entries', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', id,
          'primary_emotion', primary_emotion,
          'sentiment_score', sentiment_score,
          'mood_intensity', mood_intensity,
          'created_at', created_at
        ) ORDER BY created_at DESC
      )
      FROM diary_entries
      WHERE user_id = p_user_id
        AND deleted_at IS NULL
        AND created_at > NOW() - (p_days || ' days')::interval
      LIMIT 20
    ),
    'latest_pattern', (
      SELECT row_to_json(ep.*)
      FROM emotional_patterns ep
      WHERE ep.user_id = p_user_id
        AND ep.period_type = 'weekly'
      ORDER BY ep.period_start DESC
      LIMIT 1
    ),
    'preferences', (
      SELECT row_to_json(np.*)
      FROM notification_preferences np
      WHERE np.user_id = p_user_id
      LIMIT 1
    )
  );
$$;

GRANT EXECUTE ON FUNCTION get_user_emotional_context(uuid, integer) TO authenticated;

-- Function to calculate notification engagement
CREATE OR REPLACE FUNCTION calculate_notification_engagement(
  p_user_id uuid,
  p_days integer DEFAULT 7
)
RETURNS decimal
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT
    CASE
      WHEN COUNT(*) = 0 THEN 1.0
      ELSE ROUND(
        COUNT(*) FILTER (WHERE opened = true OR action_taken = true)::decimal /
        COUNT(*)::decimal,
        2
      )
    END
  FROM notification_history
  WHERE user_id = p_user_id
    AND sent_at > NOW() - (p_days || ' days')::interval;
$$;

GRANT EXECUTE ON FUNCTION calculate_notification_engagement(uuid, integer) TO authenticated;

-- ============================================
-- 8. SEED DATA - SUPPORT RESOURCES
-- ============================================

INSERT INTO support_resources (title, description, resource_type, url, trigger_emotions, trigger_stress_level, locale, priority)
VALUES
  (
    'CVV - Centro de Valorização da Vida',
    'Apoio emocional e prevenção do suicídio. Atendimento 24h por telefone, chat e email.',
    'hotline',
    'https://www.cvv.org.br/',
    ARRAY['sad', 'lonely', 'anxious', 'overwhelmed'],
    4,
    'pt-BR',
    10
  ),
  (
    'Mapa da Saúde Mental',
    'Encontre psicólogos e psiquiatras na sua região. Opções gratuitas e particulares.',
    'therapist_finder',
    'https://www.mapadasaudemental.com.br/',
    ARRAY['stressed', 'anxious', 'sad', 'overwhelmed'],
    3,
    'pt-BR',
    8
  ),
  (
    'Meditação Guiada para Mães',
    'Exercícios de respiração e meditação de 5 minutos para reduzir ansiedade.',
    'meditation',
    'https://www.youtube.com/watch?v=exemplo',
    ARRAY['anxious', 'stressed', 'overwhelmed'],
    2,
    'pt-BR',
    5
  ),
  (
    'Saúde Mental Materna - Artigos',
    'Informações sobre depressão pós-parto, ansiedade materna e autocuidado.',
    'article',
    'https://example.com/saude-mental-materna',
    ARRAY['sad', 'anxious', 'guilty'],
    2,
    'pt-BR',
    6
  ),
  (
    'Ligue 188 - CVV',
    'Disque 188 para falar com voluntário do CVV. Ligação gratuita e sigilosa 24h.',
    'hotline',
    NULL,
    ARRAY['sad', 'lonely', 'overwhelmed'],
    5,
    'pt-BR',
    10
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- 9. UPDATE TRIGGERS
-- ============================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_diary_entries_updated_at
  BEFORE UPDATE ON diary_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_habit_reminders_updated_at
  BEFORE UPDATE ON habit_reminders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_resources_updated_at
  BEFORE UPDATE ON support_resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 10. COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE diary_entries IS 'User diary entries with automated emotion detection';
COMMENT ON TABLE emotional_patterns IS 'Aggregated emotional patterns over time periods';
COMMENT ON TABLE notification_preferences IS 'User preferences for AI-adjusted notifications';
COMMENT ON TABLE habit_reminders IS 'Habit tracking with emotional intelligence';
COMMENT ON TABLE notification_history IS 'History of sent notifications for analytics';
COMMENT ON TABLE support_resources IS 'Mental health and support resources';

COMMENT ON COLUMN diary_entries.content_encrypted IS 'Encrypted version of content for privacy';
COMMENT ON COLUMN diary_entries.sentiment_score IS 'Sentiment score from -1 (negative) to 1 (positive)';
COMMENT ON COLUMN emotional_patterns.mood_volatility IS 'How much mood varies (0-1)';
COMMENT ON COLUMN notification_preferences.ai_adjustment_enabled IS 'Enable AI-based notification adjustments';
COMMENT ON COLUMN habit_reminders.adjust_for_emotions IS 'Allow emotional intelligence to adjust this reminder';
