/*
  Advanced Features Migration - ClubNath VIP
  
  This migration adds tables for:
  - Advanced matching system with AI compatibility
  - Safety community features
  - Virtual try-on system
  - Baby health integration with OLLIN
  
  Features:
  - Enhanced profiles with lifestyle and preferences
  - Safety alerts and community response
  - AR try-on sessions and results
  - Baby profiles and health tracking
  - Product catalog for virtual try-on
*/

-- ============================================
-- 1. ENHANCED PROFILES TABLE
-- ============================================

-- Add new columns to existing profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS interests text[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS children_age text[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS motherhood_stage text CHECK (motherhood_stage IN ('pregnant', 'new_mom', 'experienced', 'grandmother'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS faith_level text CHECK (faith_level IN ('beginner', 'intermediate', 'advanced'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS personality_traits text[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS goals text[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lifestyle jsonb DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS safety_concerns text[] DEFAULT '{}';

-- Create index for matching queries
CREATE INDEX IF NOT EXISTS idx_profiles_motherhood_stage ON profiles(motherhood_stage);
CREATE INDEX IF NOT EXISTS idx_profiles_faith_level ON profiles(faith_level);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);
CREATE INDEX IF NOT EXISTS idx_profiles_interests ON profiles USING GIN(interests);

-- ============================================
-- 2. SAFETY COMMUNITY TABLES
-- ============================================

-- Safety Alerts
CREATE TABLE IF NOT EXISTS safety_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('emergency', 'suspicious', 'unsafe_area', 'travel', 'meeting')),
  location jsonb NOT NULL, -- {latitude, longitude, address, city}
  description text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'false_alarm')),
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  verified_by uuid[] DEFAULT '{}',
  community_response jsonb DEFAULT '{}'
);

-- Safety Buddies
CREATE TABLE IF NOT EXISTS safety_buddies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  buddy_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  relationship text NOT NULL CHECK (relationship IN ('friend', 'family', 'neighbor', 'community')),
  contact_info jsonb NOT NULL, -- {phone, emergency_contact, can_track_location}
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  created_at timestamptz DEFAULT now(),
  last_check_in timestamptz,
  UNIQUE(user_id, buddy_id)
);

-- Safety Routes
CREATE TABLE IF NOT EXISTS safety_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  start_location jsonb NOT NULL,
  end_location jsonb NOT NULL,
  waypoints jsonb[] DEFAULT '{}',
  safety_score decimal(3,2) DEFAULT 0.5,
  estimated_duration integer, -- minutes
  is_safe boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Safety Tracking Sessions
CREATE TABLE IF NOT EXISTS safety_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_location jsonb NOT NULL,
  end_location jsonb NOT NULL,
  estimated_duration integer NOT NULL,
  actual_duration integer,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

-- ============================================
-- 3. VIRTUAL TRY-ON TABLES
-- ============================================

-- Products Catalog
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL,
  category text NOT NULL CHECK (category IN ('swimwear', 'activewear', 'casual', 'formal')),
  price decimal(10,2) NOT NULL,
  images text[] DEFAULT '{}',
  sizes text[] DEFAULT '{}',
  colors text[] DEFAULT '{}',
  materials text[] DEFAULT '{}',
  description text,
  features text[] DEFAULT '{}',
  care_instructions text[] DEFAULT '{}',
  availability boolean DEFAULT true,
  rating decimal(3,2) DEFAULT 0.0,
  reviews_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- AR Try-On Sessions
CREATE TABLE IF NOT EXISTS ar_tryon_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  products_tried text[] DEFAULT '{}',
  measurements jsonb NOT NULL, -- UserMeasurements
  preferences jsonb DEFAULT '{}',
  session_duration integer DEFAULT 0, -- minutes
  created_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

-- Virtual Try-On Results
CREATE TABLE IF NOT EXISTS virtual_tryon_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  measurements jsonb NOT NULL,
  fit_analysis jsonb NOT NULL,
  style_analysis jsonb NOT NULL,
  ar_preview jsonb NOT NULL,
  recommendations jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 4. BABY HEALTH TABLES
-- ============================================

-- Baby Profiles
CREATE TABLE IF NOT EXISTS baby_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  birth_date date NOT NULL,
  gender text NOT NULL CHECK (gender IN ('male', 'female')),
  weight_at_birth decimal(4,2), -- kg
  height_at_birth decimal(5,2), -- cm
  gestational_age integer, -- weeks
  birth_conditions text[] DEFAULT '{}',
  family_history jsonb DEFAULT '{}',
  health_tracking jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Baby Test Results
CREATE TABLE IF NOT EXISTS baby_test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  baby_id uuid NOT NULL REFERENCES baby_profiles(id) ON DELETE CASCADE,
  test_type text NOT NULL CHECK (test_type IN ('babytest_plus', 'babytest_basic', 'babytest_premium')),
  test_date timestamptz NOT NULL,
  results jsonb NOT NULL,
  raw_data jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'requires_attention')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Health Recommendations
CREATE TABLE IF NOT EXISTS health_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id uuid NOT NULL REFERENCES baby_profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('nutrition', 'development', 'safety', 'medical', 'preventive')),
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  title text NOT NULL,
  description text NOT NULL,
  action_items text[] DEFAULT '{}',
  resources jsonb DEFAULT '{}',
  due_date timestamptz,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- BabyTest Appointments
CREATE TABLE IF NOT EXISTS babytest_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  baby_id uuid NOT NULL REFERENCES baby_profiles(id) ON DELETE CASCADE,
  test_type text NOT NULL,
  ollin_appointment_id text,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 5. NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all new tables
ALTER TABLE safety_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_buddies ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ar_tryon_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_tryon_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE baby_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE baby_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE babytest_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. RLS POLICIES
-- ============================================

-- Safety Alerts Policies
CREATE POLICY "Users can view safety alerts in their area" ON safety_alerts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create their own safety alerts" ON safety_alerts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own safety alerts" ON safety_alerts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Safety Buddies Policies
CREATE POLICY "Users can view their safety buddies" ON safety_buddies
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR auth.uid() = buddy_id);

CREATE POLICY "Users can create safety buddy relationships" ON safety_buddies
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their safety buddy relationships" ON safety_buddies
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Safety Routes Policies
CREATE POLICY "Users can view public safety routes" ON safety_routes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create their own safety routes" ON safety_routes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own safety routes" ON safety_routes
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Safety Tracking Policies
CREATE POLICY "Users can view their own tracking sessions" ON safety_tracking
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tracking sessions" ON safety_tracking
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tracking sessions" ON safety_tracking
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Products Policies (Public read, Admin write)
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT TO authenticated USING (true);

-- AR Try-On Sessions Policies
CREATE POLICY "Users can view their own try-on sessions" ON ar_tryon_sessions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own try-on sessions" ON ar_tryon_sessions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own try-on sessions" ON ar_tryon_sessions
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Virtual Try-On Results Policies
CREATE POLICY "Users can view their own try-on results" ON virtual_tryon_results
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own try-on results" ON virtual_tryon_results
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Baby Profiles Policies
CREATE POLICY "Users can view their own baby profiles" ON baby_profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own baby profiles" ON baby_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own baby profiles" ON baby_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Baby Test Results Policies
CREATE POLICY "Users can view their own baby test results" ON baby_test_results
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own baby test results" ON baby_test_results
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own baby test results" ON baby_test_results
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Health Recommendations Policies
CREATE POLICY "Users can view their own health recommendations" ON health_recommendations
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM baby_profiles 
      WHERE baby_profiles.id = health_recommendations.baby_id 
      AND baby_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own health recommendations" ON health_recommendations
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM baby_profiles 
      WHERE baby_profiles.id = health_recommendations.baby_id 
      AND baby_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own health recommendations" ON health_recommendations
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM baby_profiles 
      WHERE baby_profiles.id = health_recommendations.baby_id 
      AND baby_profiles.user_id = auth.uid()
    )
  );

-- BabyTest Appointments Policies
CREATE POLICY "Users can view their own appointments" ON babytest_appointments
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own appointments" ON babytest_appointments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments" ON babytest_appointments
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Notifications Policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT TO authenticated USING (auth.uid() = recipient_id);

CREATE POLICY "Users can create notifications" ON notifications
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE TO authenticated USING (auth.uid() = recipient_id);

-- ============================================
-- 8. INDEXES FOR PERFORMANCE
-- ============================================

-- Safety indexes
CREATE INDEX IF NOT EXISTS idx_safety_alerts_location ON safety_alerts USING GIN(location);
CREATE INDEX IF NOT EXISTS idx_safety_alerts_created_at ON safety_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_safety_alerts_status ON safety_alerts(status);
CREATE INDEX IF NOT EXISTS idx_safety_buddies_user_id ON safety_buddies(user_id);
CREATE INDEX IF NOT EXISTS idx_safety_buddies_buddy_id ON safety_buddies(buddy_id);
CREATE INDEX IF NOT EXISTS idx_safety_routes_user_id ON safety_routes(user_id);
CREATE INDEX IF NOT EXISTS idx_safety_tracking_user_id ON safety_tracking(user_id);

-- Product indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_availability ON products(availability);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC);

-- Try-on indexes
CREATE INDEX IF NOT EXISTS idx_ar_tryon_sessions_user_id ON ar_tryon_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_virtual_tryon_results_user_id ON virtual_tryon_results(user_id);
CREATE INDEX IF NOT EXISTS idx_virtual_tryon_results_product_id ON virtual_tryon_results(product_id);

-- Baby health indexes
CREATE INDEX IF NOT EXISTS idx_baby_profiles_user_id ON baby_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_baby_test_results_user_id ON baby_test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_baby_test_results_baby_id ON baby_test_results(baby_id);
CREATE INDEX IF NOT EXISTS idx_health_recommendations_baby_id ON health_recommendations(baby_id);
CREATE INDEX IF NOT EXISTS idx_health_recommendations_priority ON health_recommendations(priority);
CREATE INDEX IF NOT EXISTS idx_babytest_appointments_user_id ON babytest_appointments(user_id);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================
-- 9. FUNCTIONS FOR AUTOMATIC UPDATES
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_baby_test_results_updated_at BEFORE UPDATE ON baby_test_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 10. SAMPLE DATA FOR TESTING
-- ============================================

-- Insert sample products
INSERT INTO products (name, brand, category, price, images, sizes, colors, materials, description, features, care_instructions, rating, reviews_count) VALUES
('Biquíni Premium', 'NAVA', 'swimwear', 299.90, ARRAY['/images/bikini1.jpg', '/images/bikini2.jpg'], ARRAY['P', 'M', 'G', 'GG'], ARRAY['Preto', 'Branco', 'Azul'], ARRAY['Poliamida', 'Elastano'], 'Biquíni premium com tecnologia UV protection', ARRAY['UV Protection', 'Secagem Rápida', 'Resistente ao Cloro'], ARRAY['Lavar à mão', 'Não usar alvejante'], 4.8, 156),
('Legging Yoga', 'NAVA', 'activewear', 199.90, ARRAY['/images/legging1.jpg'], ARRAY['P', 'M', 'G', 'GG'], ARRAY['Preto', 'Rosa', 'Azul'], ARRAY['Poliamida', 'Elastano'], 'Legging para yoga com tecnologia de compressão', ARRAY['Compressão', 'Transpirabilidade', 'Elasticidade'], ARRAY['Lavar na máquina', 'Não secar na máquina'], 4.6, 89),
('Vestido Casual', 'NAVA', 'casual', 249.90, ARRAY['/images/vestido1.jpg'], ARRAY['P', 'M', 'G', 'GG'], ARRAY['Floral', 'Preto', 'Branco'], ARRAY['Algodão', 'Elastano'], 'Vestido casual perfeito para o dia a dia', ARRAY['Confortável', 'Versátil', 'Fácil de Cuidar'], ARRAY['Lavar na máquina', 'Passar a ferro'], 4.7, 203);

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Log successful migration
INSERT INTO public.migration_log (migration_name, executed_at, status) 
VALUES ('20250123_advanced_features', now(), 'completed')
ON CONFLICT (migration_name) DO UPDATE SET 
  executed_at = now(), 
  status = 'completed';

-- Create migration log table if it doesn't exist
CREATE TABLE IF NOT EXISTS migration_log (
  migration_name text PRIMARY KEY,
  executed_at timestamptz DEFAULT now(),
  status text DEFAULT 'completed'
);
