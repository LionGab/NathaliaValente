// =====================================================
// CLUBNATH BIBLE STUDIES - SERVIÇO COMPLETO
// Sistema de Estudos Bíblicos Personalizados
// =====================================================

import { supabase } from '../lib/supabase';
import type {
  BibleStudy,
  UserBibleProgress,
  StudyPlan,
  UserStudyPlan,
  FavoriteVerse,
  DailyReflection,
  BibleStudyService,
  BibleStudyFilters,
  UpdateProgressData,
  CreateFavoriteVerseData,
  CreateReflectionData,
  DailyStudyResult,
  NathIAStudyContext,
  NathIAStudyResponse
} from '../types/bible-studies';
import { 
  STUDY_CATEGORIES,
  DIFFICULTY_LEVELS,
  MOOD_TYPES,
  formatStudyTime,
  getStreakMessage,
  generateStudyEncouragement,
  getStudyRecommendation,
  calculateStudyStats
} from '../types/bible-studies';

// =====================================================
// SERVIÇO PRINCIPAL DE ESTUDOS BÍBLICOS
// =====================================================

export const bibleStudiesService: BibleStudyService = {
  // =====================================================
  // ESTUDOS
  // =====================================================
  
  async getBibleStudies(filters: BibleStudyFilters = {}): Promise<BibleStudy[]> {
    const {
      category,
      difficulty_level,
      day,
      limit = 50,
      offset = 0
    } = filters;

    let queryBuilder = supabase
      .from('bible_studies')
      .select('*')
      .order('day', { ascending: true })
      .range(offset, offset + limit - 1);

    // Filtros opcionais
    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }
    
    if (difficulty_level) {
      queryBuilder = queryBuilder.eq('difficulty_level', difficulty_level);
    }
    
    if (day) {
      queryBuilder = queryBuilder.eq('day', day);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error fetching bible studies:', error);
      throw new Error('Erro ao buscar estudos bíblicos');
    }

    return data || [];
  },

  async getBibleStudyById(id: string): Promise<BibleStudy> {
    const { data, error } = await supabase
      .from('bible_studies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching bible study:', error);
      throw new Error('Erro ao buscar estudo bíblico');
    }

    return data;
  },

  async getDailyStudy(userId: string, day?: number): Promise<DailyStudyResult> {
    const { data, error } = await supabase.rpc('get_daily_study', {
      p_user_id: userId,
      p_day: day
    });

    if (error) {
      console.error('Error getting daily study:', error);
      throw new Error('Erro ao buscar estudo do dia');
    }

    if (!data || data.length === 0) {
      throw new Error('Nenhum estudo encontrado');
    }

    const result = data[0];
    
    // Buscar próximo estudo
    const nextStudy = await this.getBibleStudies({ 
      day: result.day + 1,
      limit: 1 
    });

    return {
      study: {
        id: result.id,
        title: result.title,
        day: result.day,
        verse: result.verse,
        verse_reference: result.verse_reference,
        reflection: result.reflection,
        question: result.question,
        prayer: result.prayer,
        practical_tip: result.practical_tip,
        category: result.category,
        difficulty_level: result.difficulty_level,
        estimated_time: result.estimated_time,
        created_at: result.created_at,
        updated_at: result.updated_at
      },
      isCompleted: result.is_completed,
      userProgress: result.user_progress,
      streakDays: result.streak_days || 0,
      nextStudy: nextStudy[0]
    };
  },

  // =====================================================
  // PROGRESSO
  // =====================================================

  async getUserProgress(userId: string): Promise<UserBibleProgress[]> {
    const { data, error } = await supabase
      .from('user_bible_progress')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching user progress:', error);
      throw new Error('Erro ao buscar progresso do usuário');
    }

    return data || [];
  },

  async updateProgress(data: UpdateProgressData): Promise<UserBibleProgress> {
    const { userId, studyId, ...progressData } = data;

    const { data: progress, error } = await supabase.rpc('update_user_study_progress', {
      p_user_id: userId,
      p_study_id: studyId,
      p_time_spent: progressData.timeSpent || 0,
      p_user_reflection: progressData.userReflection || null,
      p_prayer_response: progressData.prayerResponse || null,
      p_practical_application: progressData.practicalApplication || null,
      p_rating: progressData.rating || null
    });

    if (error) {
      console.error('Error updating progress:', error);
      throw new Error('Erro ao atualizar progresso');
    }

    // Buscar o progresso atualizado
    const { data: updatedProgress, error: fetchError } = await supabase
      .from('user_bible_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('study_id', studyId)
      .single();

    if (fetchError) {
      console.error('Error fetching updated progress:', fetchError);
      throw new Error('Erro ao buscar progresso atualizado');
    }

    return updatedProgress;
  },

  async getStudyStreak(userId: string): Promise<number> {
    const { data, error } = await supabase.rpc('calculate_study_streak', {
      p_user_id: userId
    });

    if (error) {
      console.error('Error calculating study streak:', error);
      return 0;
    }

    return data || 0;
  },

  // =====================================================
  // PLANOS
  // =====================================================

  async getStudyPlans(category?: string): Promise<StudyPlan[]> {
    let queryBuilder = supabase
      .from('study_plans')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error fetching study plans:', error);
      throw new Error('Erro ao buscar planos de estudo');
    }

    return data || [];
  },

  async enrollInPlan(userId: string, planId: string): Promise<UserStudyPlan> {
    const { data, error } = await supabase
      .from('user_study_plans')
      .insert({
        user_id: userId,
        plan_id: planId
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error enrolling in plan:', error);
      throw new Error('Erro ao se inscrever no plano');
    }

    return data;
  },

  async getUserPlans(userId: string): Promise<UserStudyPlan[]> {
    const { data, error } = await supabase
      .from('user_study_plans')
      .select(`
        *,
        study_plans (
          name,
          description,
          category,
          total_days,
          difficulty_level
        )
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('started_at', { ascending: false });

    if (error) {
      console.error('Error fetching user plans:', error);
      throw new Error('Erro ao buscar planos do usuário');
    }

    return data || [];
  },

  // =====================================================
  // VERSÍCULOS FAVORITOS
  // =====================================================

  async getFavoriteVerses(userId: string): Promise<FavoriteVerse[]> {
    const { data, error } = await supabase
      .from('favorite_verses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favorite verses:', error);
      throw new Error('Erro ao buscar versículos favoritos');
    }

    return data || [];
  },

  async addFavoriteVerse(data: CreateFavoriteVerseData): Promise<FavoriteVerse> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Usuário não autenticado');

    const { data: verse, error } = await supabase
      .from('favorite_verses')
      .insert({
        ...data,
        user_id: user.user.id
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error adding favorite verse:', error);
      throw new Error('Erro ao adicionar versículo favorito');
    }

    return verse;
  },

  async removeFavoriteVerse(id: string): Promise<void> {
    const { error } = await supabase
      .from('favorite_verses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing favorite verse:', error);
      throw new Error('Erro ao remover versículo favorito');
    }
  },

  // =====================================================
  // REFLEXÕES
  // =====================================================

  async getDailyReflections(userId: string, limit = 20): Promise<DailyReflection[]> {
    const { data, error } = await supabase
      .from('daily_reflections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching daily reflections:', error);
      throw new Error('Erro ao buscar reflexões diárias');
    }

    return data || [];
  },

  async createReflection(data: CreateReflectionData): Promise<DailyReflection> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Usuário não autenticado');

    const { data: reflection, error } = await supabase
      .from('daily_reflections')
      .insert({
        ...data,
        user_id: user.user.id
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating reflection:', error);
      throw new Error('Erro ao criar reflexão');
    }

    return reflection;
  },

  async updateReflection(id: string, data: Partial<CreateReflectionData>): Promise<DailyReflection> {
    const { data: reflection, error } = await supabase
      .from('daily_reflections')
      .update(data)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating reflection:', error);
      throw new Error('Erro ao atualizar reflexão');
    }

    return reflection;
  }
};

// =====================================================
// FUNÇÕES AUXILIARES PARA NATHIA
// =====================================================

export const getNathIAStudyContext = async (userId: string): Promise<NathIAStudyContext> => {
  try {
    const [dailyStudy, reflections, favoriteVerses, streak] = await Promise.all([
      bibleStudiesService.getDailyStudy(userId).catch(() => null),
      bibleStudiesService.getDailyReflections(userId, 5),
      bibleStudiesService.getFavoriteVerses(userId),
      bibleStudiesService.getStudyStreak(userId)
    ]);

    // Determinar humor baseado nas reflexões recentes
    const recentMoods = reflections
      .filter(r => r.mood)
      .slice(0, 3)
      .map(r => r.mood!);
    
    const userMood = recentMoods.length > 0 
      ? recentMoods[0] // Usar o humor mais recente
      : 'hopeful'; // Default

    // Identificar necessidades espirituais
    const spiritualNeeds: string[] = [];
    if (userMood === 'overwhelmed') spiritualNeeds.push('paz', 'descanso');
    if (userMood === 'struggling') spiritualNeeds.push('força', 'perseverança');
    if (userMood === 'anxious') spiritualNeeds.push('confiança', 'tranquilidade');
    if (userMood === 'grateful') spiritualNeeds.push('gratidão', 'bênçãos');
    if (userMood === 'hopeful') spiritualNeeds.push('esperança', 'futuro');
    if (userMood === 'peaceful') spiritualNeeds.push('paz', 'contentamento');

    return {
      currentStudy: dailyStudy?.study,
      recentReflections: reflections,
      favoriteVerses,
      studyStreak: streak,
      userMood,
      spiritualNeeds
    };
  } catch (error) {
    console.error('Error getting NathIA study context:', error);
    return {
      recentReflections: [],
      favoriteVerses: [],
      studyStreak: 0,
      userMood: 'hopeful',
      spiritualNeeds: ['apoio', 'encorajamento']
    };
  }
};

export const generateNathIAStudyResponse = async (
  userMessage: string,
  userId: string
): Promise<NathIAStudyResponse> => {
  try {
    const context = await getNathIAStudyContext(userId);
    
    // Determinar se deve sugerir um estudo
    const shouldSuggestStudy = 
      userMessage.toLowerCase().includes('estudo') ||
      userMessage.toLowerCase().includes('bíblia') ||
      userMessage.toLowerCase().includes('versículo') ||
      userMessage.toLowerCase().includes('oração') ||
      context.studyStreak === 0;

    // Gerar resposta personalizada
    let message = '';
    let suggestedStudy: BibleStudy | undefined;
    let encouragement = '';
    let prayer = '';
    let practicalTip = '';

    if (context.currentStudy && !shouldSuggestStudy) {
      // Usuário já tem um estudo em andamento
      message = `Miga, vejo que você está no ${context.currentStudy.day}º dia do estudo "${context.currentStudy.title}". Como está sendo essa reflexão para você?`;
      
      if (context.studyStreak > 0) {
        message += ` Que lindo ver sua dedicação de ${context.studyStreak} dias seguidos! 💜`;
      }
    } else if (shouldSuggestStudy) {
      // Sugerir um estudo baseado no contexto
      const studies = await bibleStudiesService.getBibleStudies({ 
        category: context.userMood === 'overwhelmed' ? 'postpartum' : 'maternity',
        limit: 1 
      });
      
      if (studies.length > 0) {
        suggestedStudy = studies[0];
        message = `Que tal um momento de reflexão espiritual? Tenho um estudo perfeito para você: "${suggestedStudy.title}". ${getStudyRecommendation(context.userMood)}`;
      } else {
        message = 'Que tal dedicarmos um tempo para reflexão espiritual hoje? Posso te ajudar a encontrar um estudo que faça sentido para o que você está vivendo.';
      }
    } else {
      // Resposta geral baseada no humor
      encouragement = generateStudyEncouragement(context.studyStreak, context.userMood);
      message = encouragement;
    }

    // Adicionar oração personalizada
    if (context.userMood === 'overwhelmed') {
      prayer = 'Pai, ajuda esta mãe a encontrar descanso em ti. Dá-lhe força para cada momento e paz para seu coração.';
    } else if (context.userMood === 'struggling') {
      prayer = 'Senhor, fortalece esta mulher corajosa. Mostra-lhe que ela é mais forte do que imagina e que tu estás com ela.';
    } else if (context.userMood === 'grateful') {
      prayer = 'Obrigada, Pai, por esta mãe grata. Continua abençoando-a e mostrando-lhe tuas maravilhas.';
    }

    // Dica prática baseada no contexto
    if (context.spiritualNeeds.includes('descanso')) {
      practicalTip = 'Que tal dedicar 10 minutos hoje para ler um versículo e respirar fundo? Pequenos momentos de conexão com Deus fazem toda diferença.';
    } else if (context.spiritualNeeds.includes('força')) {
      practicalTip = 'Escreva um versículo de força em um post-it e cole onde você vê todos os dias. A Palavra de Deus é nossa fortaleza!';
    } else if (context.spiritualNeeds.includes('paz')) {
      practicalTip = 'Quando sentir ansiedade, respire fundo e repita: "A paz de Deus guarda meu coração". A respiração consciente acalma a alma.';
    }

    return {
      message,
      suggestedStudy,
      encouragement,
      prayer,
      practicalTip,
      contextUsed: true
    };

  } catch (error) {
    console.error('Error generating NathIA study response:', error);
    return {
      message: 'Que tal dedicarmos um tempo para reflexão espiritual hoje? Estou aqui para te apoiar nessa jornada de fé. 💜',
      contextUsed: false
    };
  }
};

// =====================================================
// HOOKS PERSONALIZADOS
// =====================================================

export const useBibleStudies = (filters?: BibleStudyFilters) => {
  return {
    queryKey: ['bible-studies', filters],
    queryFn: () => bibleStudiesService.getBibleStudies(filters)
  };
};

export const useDailyStudy = (userId: string, day?: number) => {
  return {
    queryKey: ['daily-study', userId, day],
    queryFn: () => bibleStudiesService.getDailyStudy(userId, day)
  };
};

export const useUserProgress = (userId: string) => {
  return {
    queryKey: ['user-progress', userId],
    queryFn: () => bibleStudiesService.getUserProgress(userId)
  };
};

export const useStudyStreak = (userId: string) => {
  return {
    queryKey: ['study-streak', userId],
    queryFn: () => bibleStudiesService.getStudyStreak(userId)
  };
};

export const useFavoriteVerses = (userId: string) => {
  return {
    queryKey: ['favorite-verses', userId],
    queryFn: () => bibleStudiesService.getFavoriteVerses(userId)
  };
};

export const useDailyReflections = (userId: string, limit?: number) => {
  return {
    queryKey: ['daily-reflections', userId, limit],
    queryFn: () => bibleStudiesService.getDailyReflections(userId, limit)
  };
};

// =====================================================
// EXPORT DEFAULT
// =====================================================

export default bibleStudiesService;
