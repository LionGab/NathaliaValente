-- Migration: Add onboarding and user preferences fields to profiles table
-- Description: Adds fields to store user onboarding completion status and personalization preferences
-- Date: 2025-01-21

-- Add onboarding completion field
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Add user goals (array of selected goals)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS goals TEXT[] DEFAULT '{}';

-- Add life phase (current life stage)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS life_phase TEXT;

-- Add interests (array of selected interests)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}';

-- Add onboarding completed timestamp
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster queries on onboarding status
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed
ON profiles(onboarding_completed);

-- Comment on new columns for documentation
COMMENT ON COLUMN profiles.onboarding_completed IS 'Indicates if user has completed the onboarding flow';
COMMENT ON COLUMN profiles.goals IS 'User selected goals from onboarding (e.g., mental-wellbeing, physical-health)';
COMMENT ON COLUMN profiles.life_phase IS 'Current life phase (e.g., student, professional, mom, entrepreneur)';
COMMENT ON COLUMN profiles.interests IS 'User selected interests (e.g., habits, journaling, motivation)';
COMMENT ON COLUMN profiles.onboarding_completed_at IS 'Timestamp when onboarding was completed';

-- Update RLS policies if needed (assuming profiles already has proper RLS)
-- Users can only update their own profiles
-- This is just a reminder - adjust if your RLS is different

-- Optional: Add trigger to set onboarding_completed_at when onboarding_completed changes to true
CREATE OR REPLACE FUNCTION set_onboarding_completed_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.onboarding_completed = TRUE AND OLD.onboarding_completed = FALSE THEN
    NEW.onboarding_completed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_onboarding_completed_timestamp ON profiles;

CREATE TRIGGER trigger_set_onboarding_completed_timestamp
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_onboarding_completed_timestamp();
