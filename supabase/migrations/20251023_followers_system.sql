-- =====================================================
-- ClubNath Followers/Connections System
-- Created: 2025-10-23
-- Description: Social connections system for users to follow each other
-- =====================================================

-- =====================================================
-- FOLLOWERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.followers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent self-following and duplicate follows
  CONSTRAINT no_self_follow CHECK (follower_id != following_id),
  UNIQUE(follower_id, following_id)
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_followers_follower_id ON public.followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_followers_following_id ON public.followers(following_id);
CREATE INDEX IF NOT EXISTS idx_followers_created_at ON public.followers(created_at);

-- =====================================================
-- ADD FOLLOWERS COUNT TO PROFILES
-- =====================================================
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0;

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_profiles_followers_count ON public.profiles(followers_count);
CREATE INDEX IF NOT EXISTS idx_profiles_following_count ON public.profiles(following_count);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;

-- Everyone can view followers
CREATE POLICY "Followers are viewable by everyone" ON public.followers
  FOR SELECT USING (true);

-- Authenticated users can follow others
CREATE POLICY "Users can follow others" ON public.followers
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = follower_id);

-- Users can unfollow others
CREATE POLICY "Users can unfollow others" ON public.followers
  FOR DELETE TO authenticated
  USING (auth.uid() = follower_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update follower counts
CREATE OR REPLACE FUNCTION public.update_follower_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment following_count for follower
    UPDATE public.profiles
    SET following_count = following_count + 1
    WHERE id = NEW.follower_id;

    -- Increment followers_count for following
    UPDATE public.profiles
    SET followers_count = followers_count + 1
    WHERE id = NEW.following_id;

    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement following_count for follower
    UPDATE public.profiles
    SET following_count = GREATEST(0, following_count - 1)
    WHERE id = OLD.follower_id;

    -- Decrement followers_count for following
    UPDATE public.profiles
    SET followers_count = GREATEST(0, followers_count - 1)
    WHERE id = OLD.following_id;

    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is following another user
CREATE OR REPLACE FUNCTION public.is_following(
  follower_user_id UUID,
  following_user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.followers
    WHERE follower_id = follower_user_id
      AND following_id = following_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get mutual followers
CREATE OR REPLACE FUNCTION public.get_mutual_followers(user_id UUID)
RETURNS TABLE (
  profile_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  followers_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.full_name,
    p.avatar_url,
    p.followers_count
  FROM public.profiles p
  WHERE p.id IN (
    -- Users that the given user follows
    SELECT f1.following_id
    FROM public.followers f1
    WHERE f1.follower_id = user_id
  )
  AND p.id IN (
    -- Users that follow the given user
    SELECT f2.follower_id
    FROM public.followers f2
    WHERE f2.following_id = user_id
  )
  ORDER BY p.full_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to update follower counts
DROP TRIGGER IF EXISTS update_follower_counts_trigger ON public.followers;
CREATE TRIGGER update_follower_counts_trigger
  AFTER INSERT OR DELETE ON public.followers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_follower_counts();

-- =====================================================
-- INITIALIZE EXISTING USER COUNTS
-- =====================================================

-- Update existing profiles with correct follower counts
DO $$
BEGIN
  -- Update followers_count
  UPDATE public.profiles p
  SET followers_count = (
    SELECT COUNT(*)
    FROM public.followers f
    WHERE f.following_id = p.id
  );

  -- Update following_count
  UPDATE public.profiles p
  SET following_count = (
    SELECT COUNT(*)
    FROM public.followers f
    WHERE f.follower_id = p.id
  );
END $$;

-- =====================================================
-- GRANTS
-- =====================================================

-- Grant necessary permissions
GRANT SELECT, INSERT, DELETE ON public.followers TO authenticated;
GRANT UPDATE (followers_count, following_count) ON public.profiles TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_following(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_mutual_followers(UUID) TO authenticated;

-- =====================================================
-- NOTES
-- =====================================================
-- This migration creates a complete followers system with:
-- 1. Followers table to track relationships
-- 2. Follower/following counts on profiles
-- 3. Indexes for performance
-- 4. RLS policies for security
-- 5. Helper functions for common queries
-- 6. Automatic count updates via triggers
--
-- To use this system:
-- 1. Run this migration in Supabase SQL Editor
-- 2. Use the followers service in your app
-- 3. Display followers/following counts on user profiles
-- =====================================================
