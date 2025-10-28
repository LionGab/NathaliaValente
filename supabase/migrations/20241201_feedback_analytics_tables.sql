-- Migration: Feedback and Analytics Tables for Nossa Maternidade
-- Created: 2024-12-01
-- Description: Tables for user feedback collection and analytics tracking

-- =============================================
-- USER FEEDBACK TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feedback_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 0 AND rating <= 10),
  feature_used TEXT, -- 'feed', 'nathia', 'tracker', 'community', etc
  user_week INTEGER, -- semana de gestação
  user_type TEXT DEFAULT 'gestante', -- 'gestante', 'mae', 'tentante'
  device_info JSONB, -- {platform: 'ios', version: '1.0.0'}
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON user_feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON user_feedback(rating);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_feature ON user_feedback(feature_used);

-- =============================================
-- ANALYTICS EVENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  event_category TEXT,
  event_params JSONB,
  user_week INTEGER,
  user_type TEXT,
  session_id TEXT,
  device_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_category ON analytics_events(event_category);

-- =============================================
-- WEEKLY ANALYSIS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS weekly_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  feedbacks_count INTEGER DEFAULT 0,
  avg_rating DECIMAL(3,2),
  nps_score INTEGER,
  analysis_json JSONB,
  insights TEXT,
  action_items JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for weekly analysis
CREATE INDEX IF NOT EXISTS idx_weekly_analysis_week ON weekly_analysis(week_start DESC);

-- =============================================
-- USER JOURNEY TRACKING
-- =============================================
CREATE TABLE IF NOT EXISTS user_journey (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  journey_step TEXT NOT NULL, -- 'onboarding_start', 'first_post', 'first_nathia', etc
  step_data JSONB,
  user_week INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for journey tracking
CREATE INDEX IF NOT EXISTS idx_journey_user_id ON user_journey(user_id);
CREATE INDEX IF NOT EXISTS idx_journey_step ON user_journey(journey_step);
CREATE INDEX IF NOT EXISTS idx_journey_created_at ON user_journey(created_at DESC);

-- =============================================
-- PERFORMANCE METRICS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL, -- 'load_time', 'api_response', 'image_load'
  metric_value DECIMAL(10,3) NOT NULL,
  metric_unit TEXT DEFAULT 'ms',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  device_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance queries
CREATE INDEX IF NOT EXISTS idx_performance_metric_name ON performance_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_performance_created_at ON performance_metrics(created_at DESC);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_journey ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- Policies for user_feedback
CREATE POLICY "Users can view own feedback" ON user_feedback
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feedback" ON user_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for analytics_events (users can only see their own events)
CREATE POLICY "Users can view own analytics" ON analytics_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for user_journey
CREATE POLICY "Users can view own journey" ON user_journey
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journey" ON user_journey
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for performance_metrics (users can only see their own metrics)
CREATE POLICY "Users can view own performance" ON performance_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own performance" ON performance_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS FOR ANALYTICS
-- =============================================

-- Function to get weekly feedback summary
CREATE OR REPLACE FUNCTION get_weekly_feedback_summary(start_date DATE, end_date DATE)
RETURNS TABLE (
  total_feedbacks BIGINT,
  avg_rating DECIMAL(3,2),
  nps_score INTEGER,
  top_features TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_feedbacks,
    ROUND(AVG(rating), 2) as avg_rating,
    ROUND(
      (COUNT(*) FILTER (WHERE rating >= 9) - COUNT(*) FILTER (WHERE rating <= 6))::DECIMAL / COUNT(*) * 100
    )::INTEGER as nps_score,
    ARRAY_AGG(DISTINCT feature_used ORDER BY feature_used) as top_features
  FROM user_feedback
  WHERE created_at >= start_date 
    AND created_at <= end_date + INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql;

-- Function to get user engagement metrics
CREATE OR REPLACE FUNCTION get_user_engagement_metrics(user_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  total_events BIGINT,
  unique_days BIGINT,
  most_used_feature TEXT,
  avg_events_per_day DECIMAL(10,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_events,
    COUNT(DISTINCT DATE(created_at)) as unique_days,
    MODE() WITHIN GROUP (ORDER BY event_category) as most_used_feature,
    ROUND(COUNT(*)::DECIMAL / GREATEST(COUNT(DISTINCT DATE(created_at)), 1), 2) as avg_events_per_day
  FROM analytics_events
  WHERE user_id = user_uuid 
    AND created_at >= NOW() - INTERVAL '1 day' * days_back;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_feedback
CREATE TRIGGER update_user_feedback_updated_at
  BEFORE UPDATE ON user_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA FOR TESTING (DEVELOPMENT ONLY)
-- =============================================

-- Insert sample feedback for testing
INSERT INTO user_feedback (user_id, feedback_text, rating, feature_used, user_week, user_type)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'Adorei o app! Muito útil para acompanhar minha gestação.', 9, 'tracker', 20, 'gestante'),
  ('00000000-0000-0000-0000-000000000000', 'NAT IA demora muito para responder.', 6, 'nathia', 18, 'gestante'),
  ('00000000-0000-0000-0000-000000000000', 'Comunidade muito acolhedora!', 10, 'community', 25, 'gestante')
ON CONFLICT DO NOTHING;

-- Insert sample analytics events
INSERT INTO analytics_events (user_id, event_name, event_category, user_week, user_type)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'app_open', 'engagement', 20, 'gestante'),
  ('00000000-0000-0000-0000-000000000000', 'post_created', 'community', 20, 'gestante'),
  ('00000000-0000-0000-0000-000000000000', 'nathia_query', 'ai_assistant', 20, 'gestante')
ON CONFLICT DO NOTHING;
