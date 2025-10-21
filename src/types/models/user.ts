/**
 * User-related type definitions
 */

export interface User {
  id: string;
  email: string;
  created_at?: string;
  updated_at?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  onboarding_completed: boolean;
  goals?: string[];
  life_phase?: string;
  interests?: string[];
}

export interface UpdateProfileInput {
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  goals?: string[];
  life_phase?: string;
  interests?: string[];
}

export interface OnboardingData {
  goals: string[];
  life_phase: string;
  interests: string[];
}
