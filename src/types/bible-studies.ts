// =====================================================
// CLUBNATH BIBLE STUDIES - TIPOS TYPESCRIPT
// Sistema de Estudos Bíblicos Personalizados
// =====================================================

export type StudyCategory =
  | 'maternity'
  | 'postpartum'
  | 'parenting'
  | 'self-care'
  | 'relationships'
  | 'faith';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type MoodType =
  | 'grateful'
  | 'struggling'
  | 'hopeful'
  | 'overwhelmed'
  | 'peaceful'
  | 'anxious';

export interface BibleStudy {
  id: string;
  title: string;
  day: number;
  verse: string;
  verse_reference: string;
  reflection: string;
  question: string;
  prayer: string;
  practical_tip: string;
  category: StudyCategory;
  difficulty_level: DifficultyLevel;
  estimated_time: number; // em minutos
  created_at: string;
  updated_at: string;
}

export interface UserBibleProgress {
  id: string;
  user_id: string;
  study_id: string;
  completed_at?: string;
  time_spent: number; // em minutos
  user_reflection?: string;
  prayer_response?: string;
  practical_application?: string;
  rating?: number; // 1-5
  created_at: string;
  updated_at: string;
}

export interface StudyPlan {
  id: string;
  name: string;
  description?: string;
  category: StudyCategory;
  total_days: number;
  difficulty_level: DifficultyLevel;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserStudyPlan {
  id: string;
  user_id: string;
  plan_id: string;
  started_at: string;
  completed_at?: string;
  current_day: number;
  streak_days: number;
  total_time_spent: number; // em minutos
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FavoriteVerse {
  id: string;
  user_id: string;
  verse_text: string;
  verse_reference: string;
  personal_note?: string;
  created_at: string;
}

export interface DailyReflection {
  id: string;
  user_id: string;
  study_id?: string;
  reflection_text: string;
  mood?: MoodType;
  prayer_requests?: string;
  gratitude_list?: string[];
  created_at: string;
}

// =====================================================
// INTERFACES PARA COMPONENTES
// =====================================================

export interface BibleStudyCardProps {
  study: BibleStudy;
  progress?: UserBibleProgress;
  onStart?: (study: BibleStudy) => void;
  onComplete?: (study: BibleStudy, progress: Partial<UserBibleProgress>) => void;
  compact?: boolean;
}

export interface DailyStudyProps {
  userId: string;
  onComplete?: (study: BibleStudy, progress: Partial<UserBibleProgress>) => void;
  showProgress?: boolean;
}

export interface StudyProgressProps {
  userId: string;
  planId?: string;
  showStreak?: boolean;
  showStats?: boolean;
}

export interface ReflectionFormProps {
  studyId?: string;
  onSave?: (reflection: Partial<DailyReflection>) => void;
  initialData?: Partial<DailyReflection>;
}

// =====================================================
// INTERFACES PARA SERVIÇOS
// =====================================================

export interface BibleStudyService {
  // Estudos
  getBibleStudies: (filters?: BibleStudyFilters) => Promise<BibleStudy[]>;
  getBibleStudyById: (id: string) => Promise<BibleStudy>;
  getDailyStudy: (userId: string, day?: number) => Promise<DailyStudyResult>;

  // Progresso
  getUserProgress: (userId: string) => Promise<UserBibleProgress[]>;
  updateProgress: (data: UpdateProgressData) => Promise<UserBibleProgress>;
  getStudyStreak: (userId: string) => Promise<number>;

  // Planos
  getStudyPlans: (category?: StudyCategory) => Promise<StudyPlan[]>;
  enrollInPlan: (userId: string, planId: string) => Promise<UserStudyPlan>;
  getUserPlans: (userId: string) => Promise<UserStudyPlan[]>;

  // Versículos Favoritos
  getFavoriteVerses: (userId: string) => Promise<FavoriteVerse[]>;
  addFavoriteVerse: (data: CreateFavoriteVerseData) => Promise<FavoriteVerse>;
  removeFavoriteVerse: (id: string) => Promise<void>;

  // Reflexões
  getDailyReflections: (userId: string, limit?: number) => Promise<DailyReflection[]>;
  createReflection: (data: CreateReflectionData) => Promise<DailyReflection>;
  updateReflection: (id: string, data: Partial<CreateReflectionData>) => Promise<DailyReflection>;
}

// =====================================================
// INTERFACES PARA FILTROS E DADOS
// =====================================================

export interface BibleStudyFilters {
  category?: StudyCategory;
  difficulty_level?: DifficultyLevel;
  day?: number;
  limit?: number;
  offset?: number;
}

export interface UpdateProgressData {
  userId: string;
  studyId: string;
  timeSpent?: number;
  userReflection?: string;
  prayerResponse?: string;
  practicalApplication?: string;
  rating?: number;
}

export interface CreateFavoriteVerseData {
  verseText: string;
  verseReference: string;
  personalNote?: string;
}

export interface CreateReflectionData {
  studyId?: string;
  reflectionText: string;
  mood?: MoodType;
  prayerRequests?: string;
  gratitudeList?: string[];
}

export interface DailyStudyResult {
  study: BibleStudy;
  isCompleted: boolean;
  userProgress?: UserBibleProgress;
  streakDays: number;
  nextStudy?: BibleStudy;
}

// =====================================================
// INTERFACES PARA NATHIA INTEGRATION
// =====================================================

export interface NathIAStudyContext {
  currentStudy?: BibleStudy;
  recentReflections: DailyReflection[];
  favoriteVerses: FavoriteVerse[];
  studyStreak: number;
  userMood: MoodType;
  spiritualNeeds: string[];
}

export interface NathIAStudyResponse {
  message: string;
  suggestedStudy?: BibleStudy;
  encouragement?: string;
  prayer?: string;
  practicalTip?: string;
  contextUsed: boolean;
}

// =====================================================
// CONSTANTES
// =====================================================

export const STUDY_CATEGORIES: Record<StudyCategory, string> = {
  maternity: 'Maternidade',
  postpartum: 'Pós-Parto',
  parenting: 'Criação de Filhos',
  'self-care': 'Autocuidado',
  relationships: 'Relacionamentos',
  faith: 'Fé e Espiritualidade',
};

export const DIFFICULTY_LEVELS: Record<DifficultyLevel, string> = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
};

export const MOOD_TYPES: Record<MoodType, string> = {
  grateful: 'Grata',
  struggling: 'Lutando',
  hopeful: 'Esperançosa',
  overwhelmed: 'Sobrecarregada',
  peaceful: 'Pacífica',
  anxious: 'Ansiosa',
};

export const MOOD_EMOJIS: Record<MoodType, string> = {
  grateful: '🙏',
  struggling: '💪',
  hopeful: '✨',
  overwhelmed: '😰',
  peaceful: '😌',
  anxious: '😟',
};

export const STUDY_CATEGORY_EMOJIS: Record<StudyCategory, string> = {
  maternity: '👶',
  postpartum: '🤱',
  parenting: '👨‍👩‍👧‍👦',
  'self-care': '💆‍♀️',
  relationships: '💕',
  faith: '⛪',
};

export const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  beginner: 'green',
  intermediate: 'yellow',
  advanced: 'red',
};

// =====================================================
// UTILITÁRIOS
// =====================================================

export const formatStudyTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
};

export const getStudyProgressPercentage = (currentDay: number, totalDays: number): number => {
  return Math.round((currentDay / totalDays) * 100);
};

export const getStreakMessage = (streakDays: number): string => {
  if (streakDays === 0) return 'Comece sua jornada espiritual hoje!';
  if (streakDays === 1) return '1 dia de estudos! Continue assim!';
  if (streakDays < 7) return `${streakDays} dias seguidos! Você está no caminho certo!`;
  if (streakDays < 30) return `${streakDays} dias! Que dedicação incrível!`;
  return `${streakDays} dias! Você é uma inspiração!`;
};

export const getMoodColor = (mood: MoodType): string => {
  const colors = {
    grateful: 'text-green-600 bg-green-100',
    struggling: 'text-orange-600 bg-orange-100',
    hopeful: 'text-blue-600 bg-blue-100',
    overwhelmed: 'text-red-600 bg-red-100',
    peaceful: 'text-purple-600 bg-purple-100',
    anxious: 'text-yellow-600 bg-yellow-100',
  };
  return colors[mood];
};

export const getCategoryColor = (category: StudyCategory): string => {
  const colors = {
    maternity: 'text-pink-600 bg-pink-100',
    postpartum: 'text-purple-600 bg-purple-100',
    parenting: 'text-blue-600 bg-blue-100',
    'self-care': 'text-green-600 bg-green-100',
    relationships: 'text-red-600 bg-red-100',
    faith: 'text-indigo-600 bg-indigo-100',
  };
  return colors[category];
};

export const getDifficultyColor = (difficulty: DifficultyLevel): string => {
  const colors = {
    beginner: 'text-green-600 bg-green-100',
    intermediate: 'text-yellow-600 bg-yellow-100',
    advanced: 'text-red-600 bg-red-100',
  };
  return colors[difficulty];
};

export const generateStudyEncouragement = (streakDays: number, mood: MoodType): string => {
  const encouragements = {
    grateful: [
      'Que lindo ver sua gratidão! Continue cultivando esse coração agradecido.',
      'Sua gratidão é um presente para todos ao seu redor.',
      'Deus se alegra com seu coração grato!',
    ],
    struggling: [
      'Você é mais forte do que imagina. Cada dia é uma vitória.',
      'Lutar não é fraqueza - é coragem em ação.',
      'Deus está com você em cada batalha.',
    ],
    hopeful: [
      'Sua esperança é um farol para outros!',
      'Que lindo ver sua fé brilhando!',
      'A esperança nunca decepciona quando está em Deus.',
    ],
    overwhelmed: [
      'Respire fundo. Você não precisa carregar tudo sozinha.',
      'Um passo de cada vez. Você vai conseguir.',
      'Deus te dá força para cada momento.',
    ],
    peaceful: [
      'Que benção ver sua paz interior!',
      'Sua tranquilidade é um presente para sua família.',
      'A paz de Deus está guardando seu coração.',
    ],
    anxious: [
      'Deus cuida de você. Confie no processo.',
      'A ansiedade não define quem você é.',
      'Você está nas mãos de quem te ama infinitamente.',
    ],
  };

  const moodEncouragements = encouragements[mood];
  const randomEncouragement =
    moodEncouragements[Math.floor(Math.random() * moodEncouragements.length)];

  if (streakDays > 0) {
    return `${randomEncouragement} E que lindo ver sua dedicação de ${streakDays} dias seguidos!`;
  }

  return randomEncouragement;
};

export const getStudyRecommendation = (mood: MoodType, category?: StudyCategory): string => {
  const recommendations = {
    grateful: 'Que tal um estudo sobre gratidão e bênçãos?',
    struggling: 'Um estudo sobre força e perseverança pode te ajudar.',
    hopeful: 'Vamos explorar a esperança e os planos de Deus?',
    overwhelmed: 'Que tal focar em descanso e paz interior?',
    peaceful: 'Que lindo momento para estudar sobre a paz de Deus!',
    anxious: 'Vamos trabalhar juntas na ansiedade e confiança?',
  };

  return recommendations[mood];
};

export const formatStudyDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Hoje';
  if (diffInDays === 1) return 'Ontem';
  if (diffInDays < 7) return `${diffInDays} dias atrás`;

  return date.toLocaleDateString('pt-BR');
};

export const validateReflectionText = (text: string): boolean => {
  return text.trim().length >= 10 && text.trim().length <= 1000;
};

export const validateRating = (rating: number): boolean => {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
};

export const getRatingStars = (rating: number): string => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
};

export const calculateStudyStats = (
  progress: UserBibleProgress[]
): {
  totalStudies: number;
  totalTime: number;
  averageRating: number;
  completionRate: number;
} => {
  const completed = progress.filter((p) => p.completed_at);
  const totalTime = progress.reduce((sum, p) => sum + p.time_spent, 0);
  const ratings = progress.filter((p) => p.rating).map((p) => p.rating!);
  const averageRating =
    ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0;
  const completionRate = progress.length > 0 ? (completed.length / progress.length) * 100 : 0;

  return {
    totalStudies: completed.length,
    totalTime,
    averageRating: Math.round(averageRating * 10) / 10,
    completionRate: Math.round(completionRate),
  };
};
