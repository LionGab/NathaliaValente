-- ============================================================================
-- NathClub Onboarding System
-- ============================================================================
-- Migration: Add onboarding fields to profiles table
-- Created: 2025-10-21
-- Description: Adds fields to track user onboarding progress and preferences
-- ============================================================================

-- Add onboarding fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS onboarding_goals JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS preferred_nickname TEXT,
ADD COLUMN IF NOT EXISTS avatar_emoji TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP WITH TIME ZONE;

-- Add index for faster queries on onboarding status
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed
ON profiles(onboarding_completed);

-- Add index for onboarding goals (JSONB GIN index for efficient queries)
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_goals
ON profiles USING GIN (onboarding_goals);

-- Add comment to document the onboarding_goals structure
COMMENT ON COLUMN profiles.onboarding_goals IS
'JSON array of user-selected onboarding goals. Example: ["connect", "faith", "journaling", "habits", "support", "inspiration"]';

-- Function to mark onboarding as completed
CREATE OR REPLACE FUNCTION complete_onboarding(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET
    onboarding_completed = TRUE,
    onboarding_completed_at = NOW()
  WHERE id = user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION complete_onboarding(UUID) TO authenticated;

-- Update RLS policies to ensure users can update their own onboarding status
-- (This should already exist, but we ensure it here)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'profiles'
    AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
    ON profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
  END IF;
END
$$;

-- ============================================================================
-- Onboarding Analytics (Optional - for future insights)
-- ============================================================================

-- Create table to track onboarding analytics
CREATE TABLE IF NOT EXISTS onboarding_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  step_name TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_seconds INTEGER GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (completed_at - started_at))::INTEGER
  ) STORED,
  skipped BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS for onboarding_analytics
ALTER TABLE onboarding_analytics ENABLE ROW LEVEL SECURITY;

-- Users can only see their own analytics
CREATE POLICY "Users can view own onboarding analytics"
ON onboarding_analytics
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own analytics
CREATE POLICY "Users can insert own onboarding analytics"
ON onboarding_analytics
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_onboarding_analytics_user_id
ON onboarding_analytics(user_id);

CREATE INDEX IF NOT EXISTS idx_onboarding_analytics_step_name
ON onboarding_analytics(step_name);

-- ============================================================================
-- Helper Functions
-- ============================================================================

-- Function to get onboarding progress
CREATE OR REPLACE FUNCTION get_onboarding_progress(user_id UUID)
RETURNS TABLE (
  completed BOOLEAN,
  current_step INTEGER,
  goals TEXT[],
  nickname TEXT,
  avatar_emoji TEXT,
  completed_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.onboarding_completed,
    p.onboarding_step,
    ARRAY(SELECT jsonb_array_elements_text(p.onboarding_goals)),
    p.preferred_nickname,
    p.avatar_emoji,
    p.onboarding_completed_at
  FROM profiles p
  WHERE p.id = user_id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_onboarding_progress(UUID) TO authenticated;

-- ============================================================================
-- Data Migration (for existing users)
-- ============================================================================

-- Mark existing users as having completed onboarding
-- (They signed up before this feature existed)
UPDATE profiles
SET
  onboarding_completed = TRUE,
  onboarding_completed_at = created_at
WHERE created_at < NOW() - INTERVAL '1 minute'
  AND onboarding_completed IS FALSE;

-- ============================================================================
-- Success Message
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Onboarding system migration completed successfully!';
  RAISE NOTICE 'Added fields: onboarding_completed, onboarding_step, onboarding_goals, preferred_nickname, avatar_emoji';
  RAISE NOTICE 'Created table: onboarding_analytics';
  RAISE NOTICE 'Created functions: complete_onboarding, get_onboarding_progress';
END
$$;
