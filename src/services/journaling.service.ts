// =====================================================
// CLUBNATH JOURNALING SERVICE
// Sistema de Journaling Guiado
// =====================================================

import { supabase } from '../lib/supabase';

export interface JournalEntry {
  id?: string;
  user_id: string;
  content: string;
  mood: 'happy' | 'neutral' | 'sad' | 'anxious' | 'tired' | 'grateful' | 'overwhelmed' | 'peaceful';
  prompt_id?: string;
  tags: string[];
  is_private: boolean;
  word_count: number;
  created_at?: string;
  updated_at?: string;
  // Relacionamentos
  prompt?: JournalPrompt;
  user?: {
    id: string;
    full_name: string;
  };
}

export interface JournalPrompt {
  id: string;
  title: string;
  content: string;
  category: 'gratitude' | 'reflection' | 'challenge' | 'growth' | 'spiritual' | 'daily';
  difficulty: 'easy' | 'medium' | 'deep';
  estimated_time: number; // em minutos
  is_active: boolean;
  created_at?: string;
}

export interface JournalStats {
  total_entries: number;
  current_streak: number;
  longest_streak: number;
  entries_this_week: number;
  entries_this_month: number;
  average_word_count: number;
  mood_distribution: Record<string, number>;
  favorite_prompts: Array<{ prompt_id: string; count: number }>;
  last_entry_date?: string;
}

export interface JournalStreak {
  current_streak: number;
  longest_streak: number;
  last_entry_date: string;
  streak_start_date: string;
}

class JournalingService {
  private static instance: JournalingService;

  private constructor() { }

  public static getInstance(): JournalingService {
    if (!JournalingService.instance) {
      JournalingService.instance = new JournalingService();
    }
    return JournalingService.instance;
  }

  // =====================================================
  // CRUD OPERATIONS
  // =====================================================

  async createJournalEntry(entry: Omit<JournalEntry, 'id' | 'word_count' | 'created_at' | 'updated_at'>): Promise<JournalEntry | null> {
    const wordCount = entry.content.trim().split(/\s+/).length;

    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        ...entry,
        word_count: wordCount
      })
      .select(`
        *,
        prompt:journal_prompts(*),
        user:profiles!journal_entries_user_id_fkey(
          id,
          full_name
        )
      `)
      .single();

    if (error) {
      console.error('Erro ao criar entrada de journal:', error);
      return null;
    }

    // Atualizar streak
    await this.updateUserStreak(entry.user_id);

    return data;
  }

  async getJournalEntries(options: {
    userId?: string;
    limit?: number;
    offset?: number;
    mood?: string;
    promptId?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {}): Promise<JournalEntry[]> {
    const { userId, limit = 20, offset = 0, mood, promptId, dateFrom, dateTo } = options;

    let query = supabase
      .from('journal_entries')
      .select(`
        *,
        prompt:journal_prompts(*),
        user:profiles!journal_entries_user_id_fkey(
          id,
          full_name
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (mood) {
      query = query.eq('mood', mood);
    }

    if (promptId) {
      query = query.eq('prompt_id', promptId);
    }

    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }

    if (dateTo) {
      query = query.lte('created_at', dateTo);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar entradas de journal:', error);
      return [];
    }

    return data || [];
  }

  async getJournalEntryById(entryId: string): Promise<JournalEntry | null> {
    const { data, error } = await supabase
      .from('journal_entries')
      .select(`
        *,
        prompt:journal_prompts(*),
        user:profiles!journal_entries_user_id_fkey(
          id,
          full_name
        )
      `)
      .eq('id', entryId)
      .single();

    if (error) {
      console.error('Erro ao buscar entrada de journal:', error);
      return null;
    }

    return data;
  }

  async updateJournalEntry(entryId: string, updates: Partial<JournalEntry>): Promise<boolean> {
    const updateData: any = { ...updates };

    if (updates.content) {
      updateData.word_count = updates.content.trim().split(/\s+/).length;
    }

    const { error } = await supabase
      .from('journal_entries')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', entryId);

    if (error) {
      console.error('Erro ao atualizar entrada de journal:', error);
      return false;
    }

    return true;
  }

  async deleteJournalEntry(entryId: string): Promise<boolean> {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entryId);

    if (error) {
      console.error('Erro ao deletar entrada de journal:', error);
      return false;
    }

    return true;
  }

  // =====================================================
  // PROMPTS
  // =====================================================

  async getJournalPrompts(options: {
    category?: string;
    difficulty?: string;
    limit?: number;
  } = {}): Promise<JournalPrompt[]> {
    const { category, difficulty, limit = 50 } = options;

    let query = supabase
      .from('journal_prompts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (category) {
      query = query.eq('category', category);
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar prompts de journal:', error);
      return [];
    }

    return data || [];
  }

  async getRandomPrompt(category?: string): Promise<JournalPrompt | null> {
    let query = supabase
      .from('journal_prompts')
      .select('*')
      .eq('is_active', true);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      console.error('Erro ao buscar prompt aleatório:', error);
      return null;
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  }

  async getDailyPrompt(): Promise<JournalPrompt | null> {
    const today = new Date().toISOString().split('T')[0];

    // Buscar prompt do dia (baseado na data)
    const { data, error } = await supabase
      .from('journal_prompts')
      .select('*')
      .eq('is_active', true)
      .eq('category', 'daily')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      // Fallback para prompt aleatório
      return this.getRandomPrompt();
    }

    return data;
  }

  // =====================================================
  // STATISTICS AND STREAKS
  // =====================================================

  async getJournalStats(userId: string): Promise<JournalStats> {
    const stats: JournalStats = {
      total_entries: 0,
      current_streak: 0,
      longest_streak: 0,
      entries_this_week: 0,
      entries_this_month: 0,
      average_word_count: 0,
      mood_distribution: {},
      favorite_prompts: []
    };

    try {
      // Total de entradas
      const { count: totalEntries } = await supabase
        .from('journal_entries')
        .select('id', { count: 'exact' })
        .eq('user_id', userId);

      stats.total_entries = totalEntries || 0;

      // Streak atual e mais longo
      const streakData = await this.getUserStreak(userId);
      stats.current_streak = streakData.current_streak;
      stats.longest_streak = streakData.longest_streak;
      stats.last_entry_date = streakData.last_entry_date;

      // Entradas desta semana
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { count: entriesThisWeek } = await supabase
        .from('journal_entries')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .gte('created_at', weekAgo.toISOString());

      stats.entries_this_week = entriesThisWeek || 0;

      // Entradas deste mês
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      const { count: entriesThisMonth } = await supabase
        .from('journal_entries')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .gte('created_at', monthAgo.toISOString());

      stats.entries_this_month = entriesThisMonth || 0;

      // Distribuição de humor
      const { data: moodData } = await supabase
        .from('journal_entries')
        .select('mood')
        .eq('user_id', userId);

      if (moodData) {
        moodData.forEach(entry => {
          stats.mood_distribution[entry.mood] = (stats.mood_distribution[entry.mood] || 0) + 1;
        });
      }

      // Prompts favoritos
      const { data: promptData } = await supabase
        .from('journal_entries')
        .select('prompt_id')
        .eq('user_id', userId)
        .not('prompt_id', 'is', null);

      if (promptData) {
        const promptCounts = promptData.reduce((acc, entry) => {
          if (entry.prompt_id) {
            acc[entry.prompt_id] = (acc[entry.prompt_id] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);

        stats.favorite_prompts = Object.entries(promptCounts)
          .map(([prompt_id, count]) => ({ prompt_id, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
      }

      // Média de palavras
      const { data: wordCountData } = await supabase
        .from('journal_entries')
        .select('word_count')
        .eq('user_id', userId);

      if (wordCountData && wordCountData.length > 0) {
        const totalWords = wordCountData.reduce((sum, entry) => sum + entry.word_count, 0);
        stats.average_word_count = Math.round(totalWords / wordCountData.length);
      }

    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
    }

    return stats;
  }

  async getUserStreak(userId: string): Promise<JournalStreak> {
    const { data, error } = await supabase
      .from('user_journal_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return {
        current_streak: 0,
        longest_streak: 0,
        last_entry_date: '',
        streak_start_date: ''
      };
    }

    return data;
  }

  private async updateUserStreak(userId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Buscar streak atual
    const { data: currentStreak } = await supabase
      .from('user_journal_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    let newStreak = 1;
    let streakStartDate = today;

    if (currentStreak) {
      // Verificar se escreveu ontem
      const { data: yesterdayEntry } = await supabase
        .from('journal_entries')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', `${yesterdayStr}T00:00:00`)
        .lt('created_at', `${yesterdayStr}T23:59:59`)
        .limit(1);

      if (yesterdayEntry && yesterdayEntry.length > 0) {
        // Continuar streak
        newStreak = currentStreak.current_streak + 1;
        streakStartDate = currentStreak.streak_start_date;
      } else {
        // Verificar se já escreveu hoje
        const { data: todayEntry } = await supabase
          .from('journal_entries')
          .select('id')
          .eq('user_id', userId)
          .gte('created_at', `${today}T00:00:00`)
          .lt('created_at', `${today}T23:59:59`)
          .limit(1);

        if (todayEntry && todayEntry.length > 0) {
          // Já escreveu hoje, manter streak atual
          newStreak = currentStreak.current_streak;
          streakStartDate = currentStreak.streak_start_date;
        } else {
          // Quebrou o streak, começar novo
          newStreak = 1;
          streakStartDate = today;
        }
      }
    }

    const longestStreak = Math.max(newStreak, currentStreak?.longest_streak || 0);

    // Atualizar ou criar streak
    await supabase
      .from('user_journal_streaks')
      .upsert({
        user_id: userId,
        current_streak: newStreak,
        longest_streak: longestStreak,
        last_entry_date: today,
        streak_start_date: streakStartDate,
        updated_at: new Date().toISOString()
      });
  }

  // =====================================================
  // NOTIFICATIONS INTEGRATION
  // =====================================================

  async sendJournalReminder(userId: string): Promise<void> {
    const { notificationsService } = await import('./notifications.service');

    // Verificar se já escreveu hoje
    const today = new Date().toISOString().split('T')[0];
    const { data: todayEntry } = await supabase
      .from('journal_entries')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', `${today}T00:00:00`)
      .lt('created_at', `${today}T23:59:59`)
      .limit(1);

    if (todayEntry && todayEntry.length > 0) {
      return; // Já escreveu hoje
    }

    // Buscar streak atual
    const streak = await this.getUserStreak(userId);

    let reminderMessage = 'Que tal refletir sobre seu dia?';
    if (streak.current_streak > 0) {
      reminderMessage = `Mantenha sua sequência de ${streak.current_streak} dias! Que tal refletir sobre seu dia?`;
    }

    await notificationsService.sendNotification('journal_reminder', userId, {
      streak: streak.current_streak,
      body: reminderMessage
    });
  }

  // =====================================================
  // SEARCH AND FILTERS
  // =====================================================

  async searchJournalEntries(userId: string, query: string, options: {
    limit?: number;
    offset?: number;
    mood?: string;
  } = {}): Promise<JournalEntry[]> {
    const { limit = 20, offset = 0, mood } = options;

    let searchQuery = supabase
      .from('journal_entries')
      .select(`
        *,
        prompt:journal_prompts(*),
        user:profiles!journal_entries_user_id_fkey(
          id,
          full_name
        )
      `)
      .eq('user_id', userId)
      .textSearch('content', query)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (mood) {
      searchQuery = searchQuery.eq('mood', mood);
    }

    const { data, error } = await searchQuery;

    if (error) {
      console.error('Erro ao buscar entradas de journal:', error);
      return [];
    }

    return data || [];
  }

  async getJournalEntriesByMood(userId: string, mood: string, limit: number = 20): Promise<JournalEntry[]> {
    return this.getJournalEntries({ userId, mood, limit });
  }

  async getJournalEntriesByDateRange(userId: string, startDate: string, endDate: string): Promise<JournalEntry[]> {
    return this.getJournalEntries({
      userId,
      dateFrom: startDate,
      dateTo: endDate,
      limit: 100
    });
  }

  // =====================================================
  // ANALYTICS
  // =====================================================

  async getJournalTrends(userId: string, days: number = 30): Promise<Array<{ date: string; count: number; mood: string }>> {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('created_at, mood')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      console.error('Erro ao buscar tendências:', error);
      return [];
    }

    const dailyData = data?.reduce((acc, entry) => {
      const date = entry.created_at.split('T')[0];
      if (!acc[date]) {
        acc[date] = { count: 0, mood: entry.mood };
      }
      acc[date].count++;
      return acc;
    }, {} as Record<string, { count: number; mood: string }>) || {};

    return Object.entries(dailyData)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async getPopularPrompts(): Promise<Array<{ prompt_id: string; count: number; prompt: JournalPrompt }>> {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('prompt_id, prompt:journal_prompts(*)')
      .not('prompt_id', 'is', null);

    if (error) {
      console.error('Erro ao buscar prompts populares:', error);
      return [];
    }

    const promptCounts = data?.reduce((acc, entry) => {
      if (entry.prompt_id) {
        acc[entry.prompt_id] = (acc[entry.prompt_id] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>) || {};

    return Object.entries(promptCounts)
      .map(([prompt_id, count]) => ({
        prompt_id,
        count,
        prompt: data?.find(d => d.prompt_id === prompt_id)?.prompt as any
      }))
      .filter(item => item.prompt)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) as Array<{ prompt_id: string; count: number; prompt: JournalPrompt }>;
  }
}

// Exportar instância singleton
export const journalingService = JournalingService.getInstance();
export default journalingService;
