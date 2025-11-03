/**
 * Nossa Maternidade - Type Definitions
 * Types for maternal wellness app
 */

export interface SentimentQuestion {
  id: number;
  question: string;
  type: 'text' | 'scale' | 'choice';
  options?: string[];
  min?: number;
  max?: number;
}

export interface SentimentAnswer {
  questionId: number;
  answer: string | number;
  timestamp: Date;
}

export interface SentimentAnalysis {
  userId: string;
  answers: SentimentAnswer[];
  emotionalState: 'calm' | 'stressed' | 'tired' | 'anxious' | 'happy';
  needsSupport: boolean;
  createdAt: Date;
}

export interface DailyRoutine {
  id: string;
  userId: string;
  date: Date;
  tasks: RoutineTask[];
}

export interface RoutineTask {
  id: string;
  title: string;
  category: 'feeding' | 'rest' | 'play' | 'selfcare';
  completed: boolean;
  time?: string;
  reminder?: boolean;
}

export interface SelfCareActivity {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  category: string;
  icon: string;
  favorited?: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  prepTime: number; // in minutes
  ageRecommendation: string;
  image?: string;
}

export interface SensoryActivity {
  id: string;
  title: string;
  description: string;
  materials: string[];
  steps: string[];
  ageRecommendation: string;
  benefits: string[];
}

export interface SleepStory {
  id: string;
  title: string;
  content: string;
  duration: number; // in minutes
  audioUrl?: string;
  illustration?: string;
}

export interface TantrumTip {
  id: string;
  situation: string;
  empathicResponse: string;
  actionSteps: string[];
  preventionTips: string[];
}

export interface NathContent {
  id: string;
  type: 'video' | 'story' | 'post' | 'insight';
  title: string;
  description: string;
  url?: string;
  thumbnail?: string;
  duration?: number;
  createdAt: Date;
  isForPregnant?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  babyName?: string;
  babyAge?: number; // in months
  isPregnant?: boolean;
  gestationalWeek?: number;
  preferences: UserPreferences;
}

export interface UserPreferences {
  favoriteActivities: string[];
  notifications: boolean;
  reminderTime?: string;
  dailySuggestions: boolean;
}

export interface WeeklyRoutineDay {
  day: string;
  date: Date;
  tasks: {
    feeding: RoutineTask[];
    rest: RoutineTask[];
    play: RoutineTask[];
    selfcare: RoutineTask[];
  };
}
