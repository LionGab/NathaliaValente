-- Dashboard Queries for Nossa Maternidade Analytics
-- Created: 2024-12-01
-- Description: SQL queries for dashboard visualization

-- =============================================
-- DASHBOARD VIEWS
-- =============================================

-- Weekly Summary View
CREATE OR REPLACE VIEW weekly_summary AS
SELECT 
  DATE_TRUNC('week', created_at) as week_start,
  COUNT(*) as total_feedbacks,
  ROUND(AVG(rating), 2) as avg_rating,
  ROUND(
    (COUNT(*) FILTER (WHERE rating >= 9) - COUNT(*) FILTER (WHERE rating <= 6))::DECIMAL / 
    NULLIF(COUNT(*), 0) * 100
  ) as nps_score,
  COUNT(*) FILTER (WHERE rating >= 9) as promoters,
  COUNT(*) FILTER (WHERE rating BETWEEN 7 AND 8) as passives,
  COUNT(*) FILTER (WHERE rating <= 6) as detractors,
  COUNT(DISTINCT user_id) as unique_users,
  MODE() WITHIN GROUP (ORDER BY feature_used) as most_used_feature
FROM user_feedback
GROUP BY DATE_TRUNC('week', created_at)
ORDER BY week_start DESC;

-- Daily Activity View
CREATE OR REPLACE VIEW daily_activity AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as feedbacks_count,
  ROUND(AVG(rating), 2) as avg_rating,
  COUNT(DISTINCT user_id) as active_users,
  COUNT(*) FILTER (WHERE feature_used = 'feed') as feed_feedback,
  COUNT(*) FILTER (WHERE feature_used = 'nathia') as nathia_feedback,
  COUNT(*) FILTER (WHERE feature_used = 'tracker') as tracker_feedback
FROM user_feedback
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- User Engagement View
CREATE OR REPLACE VIEW user_engagement AS
SELECT 
  user_id,
  COUNT(*) as total_feedbacks,
  ROUND(AVG(rating), 2) as avg_rating,
  MIN(created_at) as first_feedback,
  MAX(created_at) as last_feedback,
  COUNT(DISTINCT feature_used) as features_used,
  MODE() WITHIN GROUP (ORDER BY feature_used) as favorite_feature,
  MODE() WITHIN GROUP (ORDER BY user_week) as typical_week
FROM user_feedback
GROUP BY user_id
ORDER BY total_feedbacks DESC;

-- Feature Performance View
CREATE OR REPLACE VIEW feature_performance AS
SELECT 
  feature_used,
  COUNT(*) as total_feedbacks,
  ROUND(AVG(rating), 2) as avg_rating,
  COUNT(*) FILTER (WHERE rating >= 8) as positive_feedback,
  COUNT(*) FILTER (WHERE rating <= 5) as negative_feedback,
  ROUND(
    COUNT(*) FILTER (WHERE rating >= 8)::DECIMAL / 
    NULLIF(COUNT(*), 0) * 100, 2
  ) as satisfaction_rate
FROM user_feedback
WHERE feature_used IS NOT NULL
GROUP BY feature_used
ORDER BY total_feedbacks DESC;

-- Weekly Analysis Summary
CREATE OR REPLACE VIEW weekly_analysis_summary AS
SELECT 
  wa.week_start,
  wa.week_end,
  wa.feedbacks_count,
  wa.avg_rating,
  wa.nps_score,
  wa.insights,
  wa.action_items->>'urgent' as urgent_action,
  wa.created_at as analysis_date
FROM weekly_analysis wa
ORDER BY wa.week_start DESC;

-- =============================================
-- DASHBOARD FUNCTIONS
-- =============================================

-- Get current week metrics
CREATE OR REPLACE FUNCTION get_current_week_metrics()
RETURNS TABLE (
  week_start DATE,
  total_feedbacks BIGINT,
  avg_rating DECIMAL(3,2),
  nps_score INTEGER,
  unique_users BIGINT,
  most_used_feature TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ws.week_start,
    ws.total_feedbacks,
    ws.avg_rating,
    ws.nps_score,
    ws.unique_users,
    ws.most_used_feature
  FROM weekly_summary ws
  WHERE ws.week_start >= DATE_TRUNC('week', CURRENT_DATE)
  ORDER BY ws.week_start DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Get feedback trends (last 4 weeks)
CREATE OR REPLACE FUNCTION get_feedback_trends()
RETURNS TABLE (
  week_start DATE,
  total_feedbacks BIGINT,
  avg_rating DECIMAL(3,2),
  nps_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ws.week_start,
    ws.total_feedbacks,
    ws.avg_rating,
    ws.nps_score
  FROM weekly_summary ws
  WHERE ws.week_start >= DATE_TRUNC('week', CURRENT_DATE - INTERVAL '4 weeks')
  ORDER BY ws.week_start DESC;
END;
$$ LANGUAGE plpgsql;

-- Get top problems (last 7 days)
CREATE OR REPLACE FUNCTION get_top_problems(days_back INTEGER DEFAULT 7)
RETURNS TABLE (
  problem_text TEXT,
  frequency BIGINT,
  avg_rating DECIMAL(3,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    LOWER(TRIM(uf.feedback_text)) as problem_text,
    COUNT(*) as frequency,
    ROUND(AVG(uf.rating), 2) as avg_rating
  FROM user_feedback uf
  WHERE uf.created_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
    AND uf.rating <= 6
    AND LENGTH(TRIM(uf.feedback_text)) > 10
  GROUP BY LOWER(TRIM(uf.feedback_text))
  HAVING COUNT(*) > 1
  ORDER BY frequency DESC, avg_rating ASC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Get user satisfaction by week of pregnancy
CREATE OR REPLACE FUNCTION get_satisfaction_by_week()
RETURNS TABLE (
  user_week INTEGER,
  total_feedbacks BIGINT,
  avg_rating DECIMAL(3,2),
  satisfaction_rate DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    uf.user_week,
    COUNT(*) as total_feedbacks,
    ROUND(AVG(uf.rating), 2) as avg_rating,
    ROUND(
      COUNT(*) FILTER (WHERE uf.rating >= 8)::DECIMAL / 
      NULLIF(COUNT(*), 0) * 100, 2
    ) as satisfaction_rate
  FROM user_feedback uf
  WHERE uf.user_week IS NOT NULL
    AND uf.user_week BETWEEN 1 AND 40
  GROUP BY uf.user_week
  ORDER BY uf.user_week;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- DASHBOARD QUERIES FOR FRONTEND
-- =============================================

-- Query 1: Current Week Overview
-- SELECT * FROM get_current_week_metrics();

-- Query 2: Feedback Trends (4 weeks)
-- SELECT * FROM get_feedback_trends();

-- Query 3: Feature Performance
-- SELECT * FROM feature_performance;

-- Query 4: Top Problems (last 7 days)
-- SELECT * FROM get_top_problems(7);

-- Query 5: User Satisfaction by Pregnancy Week
-- SELECT * FROM get_satisfaction_by_week();

-- Query 6: Recent Feedback (last 24h)
-- SELECT 
--   uf.feedback_text,
--   uf.rating,
--   uf.feature_used,
--   uf.user_week,
--   uf.created_at
-- FROM user_feedback uf
-- WHERE uf.created_at >= NOW() - INTERVAL '24 hours'
-- ORDER BY uf.created_at DESC
-- LIMIT 20;

-- Query 7: Weekly Analysis with Actions
-- SELECT * FROM weekly_analysis_summary LIMIT 5;

-- =============================================
-- INDEXES FOR DASHBOARD PERFORMANCE
-- =============================================

-- Indexes for better dashboard query performance
CREATE INDEX IF NOT EXISTS idx_feedback_week_rating ON user_feedback(DATE_TRUNC('week', created_at), rating);
CREATE INDEX IF NOT EXISTS idx_feedback_feature_rating ON user_feedback(feature_used, rating);
CREATE INDEX IF NOT EXISTS idx_feedback_user_week_rating ON user_feedback(user_week, rating);
CREATE INDEX IF NOT EXISTS idx_feedback_recent ON user_feedback(created_at DESC) WHERE created_at >= NOW() - INTERVAL '30 days';

-- =============================================
-- SAMPLE DASHBOARD DATA (DEVELOPMENT)
-- =============================================

-- Insert sample weekly analysis for testing
INSERT INTO weekly_analysis (
  week_start, 
  week_end, 
  feedbacks_count, 
  avg_rating, 
  nps_score, 
  insights, 
  action_items
) VALUES 
  (CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE - INTERVAL '1 day', 15, 8.2, 67, 
   'Usuárias estão satisfeitas com o tracker, mas NAT IA precisa melhorar', 
   '{"urgent": "Melhorar resposta da NAT IA", "problems": [{"problema": "NAT IA lenta", "freq": 5, "severidade": "alta"}]}'),
  (CURRENT_DATE - INTERVAL '14 days', CURRENT_DATE - INTERVAL '8 days', 12, 7.8, 58, 
   'Feedback positivo sobre comunidade, mas onboarding confuso', 
   '{"urgent": "Simplificar onboarding", "problems": [{"problema": "Onboarding longo", "freq": 3, "severidade": "media"}]}')
ON CONFLICT DO NOTHING;
