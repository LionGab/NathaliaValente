-- Migration: Privacy Controls and Settings
-- Description: Add privacy controls for posts, journal entries, and user settings
-- Date: 2025-01-22

-- Add visibility column to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'followers_only', 'private'));

-- Add privacy settings table
CREATE TABLE IF NOT EXISTS privacy_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  default_post_visibility TEXT DEFAULT 'public' CHECK (default_post_visibility IN ('public', 'followers_only', 'private')),
  allow_comments BOOLEAN DEFAULT true,
  allow_direct_messages TEXT DEFAULT 'followers_only' CHECK (allow_direct_messages IN ('everyone', 'followers_only', 'none')),
  show_online_status BOOLEAN DEFAULT true,
  allow_profile_discovery BOOLEAN DEFAULT true,
  data_retention_days INTEGER DEFAULT 365,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add welcome challenge tracking to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS welcome_challenge TEXT,
ADD COLUMN IF NOT EXISTS welcome_challenge_accepted_at TIMESTAMP WITH TIME ZONE;

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('engagement', 'milestone', 'special', 'community')),
  requirements JSONB NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  UNIQUE(user_id, badge_id)
);

-- Create user_points table for gamification
CREATE TABLE IF NOT EXISTS user_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create point_transactions table
CREATE TABLE IF NOT EXISTS point_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference_id UUID, -- Can reference posts, comments, etc.
  reference_type TEXT, -- 'post', 'comment', 'habit', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert predefined badges
INSERT INTO badges (name, description, icon, color, category, requirements, rarity) VALUES
('Primeira Postagem', 'Parabéns pela sua primeira postagem no ClubNath!', '🌟', '#FFD700', 'milestone', '{"type": "posts", "value": 1, "description": "Faça sua primeira postagem"}', 'common'),
('Social Butterfly', 'Você é uma borboleta social! Continue interagindo!', '🦋', '#FF69B4', 'engagement', '{"type": "comments", "value": 50, "description": "Faça 50 comentários"}', 'rare'),
('Influencer', 'Suas postagens são um sucesso!', '📈', '#8A2BE2', 'engagement', '{"type": "likes", "value": 1000, "description": "Receba 1000 likes no total"}', 'epic'),
('Membro Fiel', 'Você é um membro fiel da comunidade!', '💎', '#00CED1', 'milestone', '{"type": "days_active", "value": 30, "description": "Seja ativo por 30 dias"}', 'rare'),
('Nathy Badge', 'Badge especial da Nath!', '👑', '#FF1493', 'special', '{"type": "special", "value": 1, "description": "Badge especial da Nath"}', 'legendary'),
('Mentora', 'Você ajuda outras mães com suas dicas!', '🤱', '#32CD32', 'community', '{"type": "posts", "value": 20, "description": "Faça 20 postagens na categoria \"Dica de mãe\""}', 'epic'),
('Fé Forte', 'Sua fé inspira outras mães!', '🙏', '#FF8C00', 'community', '{"type": "posts", "value": 15, "description": "Faça 15 postagens na categoria \"Fé\""}', 'rare'),
('Estilo Próprio', 'Você tem um estilo único!', '✨', '#9370DB', 'community', '{"type": "posts", "value": 10, "description": "Faça 10 postagens na categoria \"Look do dia\""}', 'rare')
ON CONFLICT DO NOTHING;

-- Row Level Security (RLS) Policies

-- Enable RLS on new tables
ALTER TABLE privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;

-- Privacy settings policies
CREATE POLICY "Users can view their own privacy settings" ON privacy_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own privacy settings" ON privacy_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own privacy settings" ON privacy_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Badges policies (public read, admin write)
CREATE POLICY "Anyone can view badges" ON badges
  FOR SELECT USING (true);

-- User badges policies
CREATE POLICY "Users can view their own badges" ON user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view other users' badges" ON user_badges
  FOR SELECT USING (true);

CREATE POLICY "System can insert user badges" ON user_badges
  FOR INSERT WITH CHECK (true);

-- User points policies
CREATE POLICY "Users can view their own points" ON user_points
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view other users' points" ON user_points
  FOR SELECT USING (true);

CREATE POLICY "System can manage user points" ON user_points
  FOR ALL USING (true);

-- Point transactions policies
CREATE POLICY "Users can view their own point transactions" ON point_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert point transactions" ON point_transactions
  FOR INSERT WITH CHECK (true);

-- Update posts RLS to include visibility
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON posts;
CREATE POLICY "Posts visibility based on user settings" ON posts
  FOR SELECT USING (
    visibility = 'public' OR
    (visibility = 'followers_only' AND (
      user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM follows 
        WHERE follower_id = auth.uid() 
        AND following_id = posts.user_id
      )
    )) OR
    (visibility = 'private' AND user_id = auth.uid())
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_visibility ON posts(visibility);
CREATE INDEX IF NOT EXISTS idx_privacy_settings_user_id ON privacy_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON user_points(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_user_id ON point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_created_at ON point_transactions(created_at);

-- Create function to automatically create privacy settings for new users
CREATE OR REPLACE FUNCTION create_default_privacy_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO privacy_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user privacy settings
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_default_privacy_settings();

-- Create function to automatically create user points for new users
CREATE OR REPLACE FUNCTION create_default_user_points()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_points (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user points
DROP TRIGGER IF EXISTS on_user_points_created ON auth.users;
CREATE TRIGGER on_user_points_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_default_user_points();

-- Create function to award points
CREATE OR REPLACE FUNCTION award_points(
  p_user_id UUID,
  p_points INTEGER,
  p_reason TEXT,
  p_reference_id UUID DEFAULT NULL,
  p_reference_type TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Insert transaction
  INSERT INTO point_transactions (user_id, points, reason, reference_id, reference_type)
  VALUES (p_user_id, p_points, p_reason, p_reference_id, p_reference_type);
  
  -- Update total points
  INSERT INTO user_points (user_id, total_points)
  VALUES (p_user_id, p_points)
  ON CONFLICT (user_id)
  DO UPDATE SET 
    total_points = user_points.total_points + p_points,
    level = GREATEST(1, FLOOR((user_points.total_points + p_points) / 100)),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check and award badges
CREATE OR REPLACE FUNCTION check_and_award_badges(p_user_id UUID)
RETURNS TABLE(badge_id UUID, badge_name TEXT) AS $$
DECLARE
  badge_record RECORD;
  user_stats RECORD;
  earned_badges UUID[];
BEGIN
  -- Get user statistics
  SELECT 
    COUNT(DISTINCT p.id) as total_posts,
    COUNT(DISTINCT CASE WHEN p.category = 'Dica de mãe' THEN p.id END) as mentor_posts,
    COUNT(DISTINCT CASE WHEN p.category = 'Fé' THEN p.id END) as faith_posts,
    COUNT(DISTINCT CASE WHEN p.category = 'Look do dia' THEN p.id END) as style_posts,
    COUNT(DISTINCT c.id) as total_comments,
    COUNT(DISTINCT pl.id) as total_likes_received,
    COUNT(DISTINCT DATE(p.created_at)) as active_days
  INTO user_stats
  FROM profiles pr
  LEFT JOIN posts p ON p.user_id = pr.id
  LEFT JOIN comments c ON c.user_id = pr.id
  LEFT JOIN post_likes pl ON pl.post_id = p.id
  WHERE pr.id = p_user_id;

  -- Get already earned badges
  SELECT ARRAY_AGG(badge_id) INTO earned_badges
  FROM user_badges
  WHERE user_id = p_user_id;

  -- Check each badge
  FOR badge_record IN 
    SELECT * FROM badges 
    WHERE id NOT IN (SELECT unnest(earned_badges))
  LOOP
    -- Check if user meets requirements
    IF badge_record.requirements->>'type' = 'posts' THEN
      IF badge_record.name = 'Mentora' AND user_stats.mentor_posts >= (badge_record.requirements->>'value')::INTEGER THEN
        INSERT INTO user_badges (user_id, badge_id) VALUES (p_user_id, badge_record.id);
        badge_id := badge_record.id;
        badge_name := badge_record.name;
        RETURN NEXT;
      ELSIF badge_record.name = 'Fé Forte' AND user_stats.faith_posts >= (badge_record.requirements->>'value')::INTEGER THEN
        INSERT INTO user_badges (user_id, badge_id) VALUES (p_user_id, badge_record.id);
        badge_id := badge_record.id;
        badge_name := badge_record.name;
        RETURN NEXT;
      ELSIF badge_record.name = 'Estilo Próprio' AND user_stats.style_posts >= (badge_record.requirements->>'value')::INTEGER THEN
        INSERT INTO user_badges (user_id, badge_id) VALUES (p_user_id, badge_record.id);
        badge_id := badge_record.id;
        badge_name := badge_record.name;
        RETURN NEXT;
      ELSIF badge_record.name = 'Primeira Postagem' AND user_stats.total_posts >= (badge_record.requirements->>'value')::INTEGER THEN
        INSERT INTO user_badges (user_id, badge_id) VALUES (p_user_id, badge_record.id);
        badge_id := badge_record.id;
        badge_name := badge_record.name;
        RETURN NEXT;
      END IF;
    ELSIF badge_record.requirements->>'type' = 'comments' AND user_stats.total_comments >= (badge_record.requirements->>'value')::INTEGER THEN
      INSERT INTO user_badges (user_id, badge_id) VALUES (p_user_id, badge_record.id);
      badge_id := badge_record.id;
      badge_name := badge_record.name;
      RETURN NEXT;
    ELSIF badge_record.requirements->>'type' = 'likes' AND user_stats.total_likes_received >= (badge_record.requirements->>'value')::INTEGER THEN
      INSERT INTO user_badges (user_id, badge_id) VALUES (p_user_id, badge_record.id);
      badge_id := badge_record.id;
      badge_name := badge_record.name;
      RETURN NEXT;
    ELSIF badge_record.requirements->>'type' = 'days_active' AND user_stats.active_days >= (badge_record.requirements->>'value')::INTEGER THEN
      INSERT INTO user_badges (user_id, badge_id) VALUES (p_user_id, badge_record.id);
      badge_id := badge_record.id;
      badge_name := badge_record.name;
      RETURN NEXT;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
