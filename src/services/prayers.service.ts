// =====================================================
// CLUBNATH PRAYERS SERVICE
// Sistema de Orações Compartilhadas
// =====================================================

import { supabase } from '../lib/supabase';

export interface PrayerPost {
  id?: string;
  user_id: string;
  content: string;
  is_anonymous: boolean;
  category?: 'gratitude' | 'request' | 'intercession' | 'praise';
  is_urgent: boolean;
  amen_count: number;
  created_at?: string;
  updated_at?: string;
  // Relacionamentos
  user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  user_amened?: boolean;
}

export interface PrayerAmen {
  id?: string;
  prayer_id: string;
  user_id: string;
  created_at?: string;
}

export interface PrayerStats {
  total_prayers: number;
  total_amens: number;
  prayers_today: number;
  amens_given: number;
  prayers_shared: number;
}

class PrayersService {
  private static instance: PrayersService;

  private constructor() {}

  public static getInstance(): PrayersService {
    if (!PrayersService.instance) {
      PrayersService.instance = new PrayersService();
    }
    return PrayersService.instance;
  }

  // =====================================================
  // CRUD OPERATIONS
  // =====================================================

  async createPrayer(prayer: Omit<PrayerPost, 'id' | 'amen_count' | 'created_at' | 'updated_at'>): Promise<PrayerPost | null> {
    const { data, error } = await supabase
      .from('prayer_posts')
      .insert({
        ...prayer,
        amen_count: 0
      })
      .select(`
        *,
        user:profiles!prayer_posts_user_id_fkey(
          id,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Erro ao criar oração:', error);
      return null;
    }

    return data;
  }

  async getPrayers(options: {
    limit?: number;
    offset?: number;
    category?: string;
    userId?: string;
  } = {}): Promise<PrayerPost[]> {
    const { limit = 20, offset = 0, category, userId } = options;

    let query = supabase
      .from('prayer_posts')
      .select(`
        *,
        user:profiles!prayer_posts_user_id_fkey(
          id,
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar orações:', error);
      return [];
    }

    return data || [];
  }

  async getPrayerById(prayerId: string): Promise<PrayerPost | null> {
    const { data, error } = await supabase
      .from('prayer_posts')
      .select(`
        *,
        user:profiles!prayer_posts_user_id_fkey(
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('id', prayerId)
      .single();

    if (error) {
      console.error('Erro ao buscar oração:', error);
      return null;
    }

    return data;
  }

  async updatePrayer(prayerId: string, updates: Partial<PrayerPost>): Promise<boolean> {
    const { error } = await supabase
      .from('prayer_posts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', prayerId);

    if (error) {
      console.error('Erro ao atualizar oração:', error);
      return false;
    }

    return true;
  }

  async deletePrayer(prayerId: string): Promise<boolean> {
    const { error } = await supabase
      .from('prayer_posts')
      .delete()
      .eq('id', prayerId);

    if (error) {
      console.error('Erro ao deletar oração:', error);
      return false;
    }

    return true;
  }

  // =====================================================
  // AMEN FUNCTIONALITY
  // =====================================================

  async addAmen(prayerId: string, userId: string): Promise<boolean> {
    // Verificar se já deu amen
    const { data: existingAmen } = await supabase
      .from('prayer_amens')
      .select('id')
      .eq('prayer_id', prayerId)
      .eq('user_id', userId)
      .single();

    if (existingAmen) {
      return false; // Já deu amen
    }

    // Adicionar amen
    const { error: amenError } = await supabase
      .from('prayer_amens')
      .insert({
        prayer_id: prayerId,
        user_id: userId
      });

    if (amenError) {
      console.error('Erro ao adicionar amen:', amenError);
      return false;
    }

    // Atualizar contador
    const { error: countError } = await supabase.rpc('increment_prayer_amen_count', {
      prayer_id: prayerId
    });

    if (countError) {
      console.error('Erro ao atualizar contador:', countError);
    }

    return true;
  }

  async removeAmen(prayerId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('prayer_amens')
      .delete()
      .eq('prayer_id', prayerId)
      .eq('user_id', userId);

    if (error) {
      console.error('Erro ao remover amen:', error);
      return false;
    }

    // Atualizar contador
    const { error: countError } = await supabase.rpc('decrement_prayer_amen_count', {
      prayer_id: prayerId
    });

    if (countError) {
      console.error('Erro ao atualizar contador:', countError);
    }

    return true;
  }

  async getUserAmens(userId: string, prayerIds: string[]): Promise<Set<string>> {
    if (prayerIds.length === 0) return new Set();

    const { data, error } = await supabase
      .from('prayer_amens')
      .select('prayer_id')
      .eq('user_id', userId)
      .in('prayer_id', prayerIds);

    if (error) {
      console.error('Erro ao buscar amens do usuário:', error);
      return new Set();
    }

    return new Set(data?.map(amen => amen.prayer_id) || []);
  }

  // =====================================================
  // STATISTICS
  // =====================================================

  async getPrayerStats(userId?: string): Promise<PrayerStats> {
    const stats: PrayerStats = {
      total_prayers: 0,
      total_amens: 0,
      prayers_today: 0,
      amens_given: 0,
      prayers_shared: 0
    };

    try {
      // Total de orações
      let prayersQuery = supabase
        .from('prayer_posts')
        .select('id', { count: 'exact' });

      if (userId) {
        prayersQuery = prayersQuery.eq('user_id', userId);
      }

      const { count: totalPrayers } = await prayersQuery;
      stats.total_prayers = totalPrayers || 0;

      // Total de amens
      let amensQuery = supabase
        .from('prayer_amens')
        .select('id', { count: 'exact' });

      if (userId) {
        amensQuery = amensQuery.eq('user_id', userId);
      }

      const { count: totalAmens } = await amensQuery;
      stats.total_amens = totalAmens || 0;

      // Orações de hoje
      const today = new Date().toISOString().split('T')[0];
      let todayQuery = supabase
        .from('prayer_posts')
        .select('id', { count: 'exact' })
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`);

      if (userId) {
        todayQuery = todayQuery.eq('user_id', userId);
      }

      const { count: prayersToday } = await todayQuery;
      stats.prayers_today = prayersToday || 0;

      // Amens dados pelo usuário
      if (userId) {
        const { count: amensGiven } = await supabase
          .from('prayer_amens')
          .select('id', { count: 'exact' })
          .eq('user_id', userId);

        stats.amens_given = amensGiven || 0;

        // Orações compartilhadas pelo usuário
        const { count: prayersShared } = await supabase
          .from('prayer_posts')
          .select('id', { count: 'exact' })
          .eq('user_id', userId);

        stats.prayers_shared = prayersShared || 0;
      }

    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }

    return stats;
  }

  // =====================================================
  // NOTIFICATIONS INTEGRATION
  // =====================================================

  async notifyNewPrayer(prayer: PrayerPost): Promise<void> {
    // Buscar usuários que seguem a categoria ou são ativos
    const { data: activeUsers } = await supabase
      .from('notification_preferences')
      .select('user_id')
      .eq('prayer_notifications', true);

    if (!activeUsers) return;

    // Enviar notificação para usuários ativos
    const { notificationsService } = await import('./notifications.service');
    
    for (const user of activeUsers) {
      if (user.user_id !== prayer.user_id) {
        await notificationsService.sendNotification('prayer_notification', user.user_id, {
          prayer_id: prayer.id,
          prayer_content: prayer.content.substring(0, 100) + '...',
          is_anonymous: prayer.is_anonymous,
          user_name: prayer.is_anonymous ? 'Uma mãe' : prayer.user?.full_name
        });
      }
    }
  }

  async notifyAmenReceived(prayerId: string, amenCount: number): Promise<void> {
    const prayer = await this.getPrayerById(prayerId);
    if (!prayer) return;

    // Notificar o autor da oração
    const { notificationsService } = await import('./notifications.service');
    
    await notificationsService.sendNotification('social_interaction', prayer.user_id, {
      type: 'prayer_amen',
      prayer_id: prayerId,
      count: amenCount,
      body: `${amenCount} mães disseram Amém na sua oração! 🙏`
    });
  }

  // =====================================================
  // SEARCH AND FILTERS
  // =====================================================

  async searchPrayers(query: string, options: {
    limit?: number;
    offset?: number;
    category?: string;
  } = {}): Promise<PrayerPost[]> {
    const { limit = 20, offset = 0, category } = options;

    let searchQuery = supabase
      .from('prayer_posts')
      .select(`
        *,
        user:profiles!prayer_posts_user_id_fkey(
          id,
          full_name,
          avatar_url
        )
      `)
      .textSearch('content', query)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      searchQuery = searchQuery.eq('category', category);
    }

    const { data, error } = await searchQuery;

    if (error) {
      console.error('Erro ao buscar orações:', error);
      return [];
    }

    return data || [];
  }

  async getPrayersByCategory(category: string, limit: number = 20): Promise<PrayerPost[]> {
    return this.getPrayers({ category, limit });
  }

  async getUrgentPrayers(limit: number = 10): Promise<PrayerPost[]> {
    const { data, error } = await supabase
      .from('prayer_posts')
      .select(`
        *,
        user:profiles!prayer_posts_user_id_fkey(
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('is_urgent', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erro ao buscar orações urgentes:', error);
      return [];
    }

    return data || [];
  }

  // =====================================================
  // ANALYTICS
  // =====================================================

  async getPopularPrayerCategories(): Promise<Array<{ category: string; count: number }>> {
    const { data, error } = await supabase
      .from('prayer_posts')
      .select('category')
      .not('category', 'is', null);

    if (error) {
      console.error('Erro ao buscar categorias populares:', error);
      return [];
    }

    const categoryCounts = data?.reduce((acc, prayer) => {
      const category = prayer.category || 'other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }

  async getPrayerTrends(days: number = 7): Promise<Array<{ date: string; count: number }>> {
    const { data, error } = await supabase
      .from('prayer_posts')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      console.error('Erro ao buscar tendências:', error);
      return [];
    }

    const dailyCounts = data?.reduce((acc, prayer) => {
      const date = prayer.created_at.split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}

// Exportar instância singleton
export const prayersService = PrayersService.getInstance();
export default prayersService;
