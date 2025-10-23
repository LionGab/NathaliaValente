-- =====================================================
-- ClubNath Events and Calendar System
-- Created: 2025-10-23
-- Description: Complete events management system with calendar,
--              registrations, and notifications
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- EVENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('workshop', 'live', 'meetup', 'webinar', 'masterclass')),
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  image_url TEXT,
  location TEXT,
  is_online BOOLEAN NOT NULL DEFAULT true,
  meeting_url TEXT,
  max_attendees INTEGER,
  current_attendees INTEGER NOT NULL DEFAULT 0,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  host_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_dates CHECK (end_date > start_date),
  CONSTRAINT valid_attendees CHECK (current_attendees >= 0),
  CONSTRAINT max_attendees_positive CHECK (max_attendees IS NULL OR max_attendees > 0)
);

-- =====================================================
-- EVENT ATTENDEES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.event_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate registrations
  UNIQUE(event_id, user_id)
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_host_id ON public.events(host_id);
CREATE INDEX IF NOT EXISTS idx_events_is_premium ON public.events(is_premium);
CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON public.event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_user_id ON public.event_attendees(user_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_status ON public.event_attendees(status);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;

-- Events policies
-- Everyone can view upcoming/ongoing events
CREATE POLICY "Events are viewable by everyone" ON public.events
  FOR SELECT USING (status IN ('upcoming', 'ongoing'));

-- Only authenticated users can create events (can be restricted to admins)
CREATE POLICY "Authenticated users can create events" ON public.events
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = host_id);

-- Hosts can update their own events
CREATE POLICY "Hosts can update their own events" ON public.events
  FOR UPDATE TO authenticated
  USING (auth.uid() = host_id)
  WITH CHECK (auth.uid() = host_id);

-- Hosts can delete their own events
CREATE POLICY "Hosts can delete their own events" ON public.events
  FOR DELETE TO authenticated
  USING (auth.uid() = host_id);

-- Event attendees policies
-- Everyone can view attendees
CREATE POLICY "Event attendees are viewable by everyone" ON public.event_attendees
  FOR SELECT USING (true);

-- Authenticated users can register for events
CREATE POLICY "Users can register for events" ON public.event_attendees
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own registrations
CREATE POLICY "Users can update their registrations" ON public.event_attendees
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can cancel their registrations
CREATE POLICY "Users can cancel their registrations" ON public.event_attendees
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to increment event attendees count
CREATE OR REPLACE FUNCTION public.increment_event_attendees(event_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.events
  SET
    current_attendees = current_attendees + 1,
    updated_at = NOW()
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement event attendees count
CREATE OR REPLACE FUNCTION public.decrement_event_attendees(event_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.events
  SET
    current_attendees = GREATEST(0, current_attendees - 1),
    updated_at = NOW()
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically update event status based on dates
CREATE OR REPLACE FUNCTION public.update_event_status()
RETURNS VOID AS $$
BEGIN
  -- Mark events as ongoing if start time has passed
  UPDATE public.events
  SET status = 'ongoing', updated_at = NOW()
  WHERE status = 'upcoming'
    AND start_date <= NOW();

  -- Mark events as completed if end time has passed
  UPDATE public.events
  SET status = 'completed', updated_at = NOW()
  WHERE status = 'ongoing'
    AND end_date <= NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to update updated_at on events
DROP TRIGGER IF EXISTS update_events_updated_at_trigger ON public.events;
CREATE TRIGGER update_events_updated_at_trigger
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_events_updated_at();

-- =====================================================
-- SAMPLE DATA (for development/testing)
-- =====================================================

-- Insert sample events (only if no events exist)
DO $$
DECLARE
  admin_id UUID;
BEGIN
  -- Get first user ID (or create a default one)
  SELECT id INTO admin_id FROM public.profiles LIMIT 1;

  IF admin_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.events LIMIT 1) THEN
    INSERT INTO public.events (
      title,
      description,
      category,
      start_date,
      end_date,
      is_online,
      is_premium,
      host_id,
      max_attendees
    ) VALUES
    (
      'Workshop: Inteligência Emocional para Mães',
      'Aprenda técnicas práticas para desenvolver sua inteligência emocional e lidar melhor com os desafios da maternidade. Com a Nath e convidadas especiais.',
      'workshop',
      NOW() + INTERVAL '7 days',
      NOW() + INTERVAL '7 days' + INTERVAL '2 hours',
      true,
      true,
      admin_id,
      50
    ),
    (
      'Live: Organização Financeira em Família',
      'Live exclusiva sobre como organizar as finanças da família e ensinar educação financeira para os filhos.',
      'live',
      NOW() + INTERVAL '3 days',
      NOW() + INTERVAL '3 days' + INTERVAL '1 hour',
      true,
      false,
      admin_id,
      200
    ),
    (
      'Masterclass: Empreendedorismo Materno',
      'Como empreender sendo mãe? Estratégias práticas para equilibrar maternidade e carreira.',
      'masterclass',
      NOW() + INTERVAL '14 days',
      NOW() + INTERVAL '14 days' + INTERVAL '3 hours',
      true,
      true,
      admin_id,
      100
    ),
    (
      'Encontro Presencial: ClubNath SP',
      'Nosso primeiro encontro presencial em São Paulo! Vamos nos conhecer pessoalmente, trocar experiências e fortalecer nossa comunidade.',
      'meetup',
      NOW() + INTERVAL '30 days',
      NOW() + INTERVAL '30 days' + INTERVAL '4 hours',
      false,
      true,
      admin_id,
      30
    );
  END IF;
END $$;

-- =====================================================
-- GRANTS
-- =====================================================

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_attendees TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_event_attendees(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_event_attendees(UUID) TO authenticated;

-- =====================================================
-- NOTES
-- =====================================================
-- This migration creates a complete events system with:
-- 1. Events table with full details and constraints
-- 2. Event attendees/registrations table
-- 3. Indexes for performance
-- 4. RLS policies for security
-- 5. Helper functions for attendee count management
-- 6. Automatic status updates based on dates
-- 7. Sample data for testing
--
-- To use this system:
-- 1. Run this migration in Supabase SQL Editor
-- 2. Optionally schedule a cron job to run update_event_status() periodically
-- 3. Use the events service in your app to interact with the data
-- =====================================================
