// =====================================================
// CLUBNATH BADGES SERVICE
// Sistema de Badges Completo
// =====================================================

import { supabase } from '../lib/supabase';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'participation' | 'faith' | 'support' | 'journey' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  color: string;
  requirements: BadgeRequirement[];
  is_active: boolean;
  created_at?: string;
}

export interface BadgeRequirement {
  type: 'posts_count' | 'comments_count' | 'likes_received' | 'days_active' | 'prayers_shared' | 'journal_entries' | 'streak_days' | 'special';
  value: number;
  description: string;
  metric?: string; // Para tracking específico
}

export interface UserBadge {
  id?: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  progress: number; // 0-100
  is_earned: boolean;
  // Relacionamentos
  badge?: Badge;
  user?: {
    id: string;
    full_name: string;
  };
}

export interface BadgeProgress {
  badge_id: string;
  badge_name: string;
  progress: number;
  requirements: BadgeRequirement[];
  is_earned: boolean;
  earned_at?: string;
}

export interface BadgeStats {
  total_badges: number;
  earned_badges: number;
  progress_badges: number;
  rare_badges: number;
  epic_badges: number;
  legendary_badges: number;
  recent_earned: Badge[];
  next_achievable: Badge[];
}

class BadgesService {
  private static instance: BadgesService;

  private constructor() {}

  public static getInstance(): BadgesService {
    if (!BadgesService.instance) {
      BadgesService.instance = new BadgesService();
    }
    return BadgesService.instance;
  }

  // =====================================================
  // BADGE DEFINITIONS
  // =====================================================

  private getBadgeDefinitions(): Badge[] {
    return [
      // PARTICIPAÇÃO
      {
        id: 'first_post',
        name: 'Primeira Publicação',
        description: 'Compartilhou seu primeiro post no ClubNath',
        icon: '📝',
        category: 'participation',
        rarity: 'common',
        color: '#10B981',
        requirements: [{ type: 'posts_count', value: 1, description: 'Fazer 1 post' }],
        is_active: true
      },
      {
        id: 'social_butterfly',
        name: 'Borboleta Social',
        description: 'Compartilhou 10 posts com a comunidade',
        icon: '🦋',
        category: 'participation',
        rarity: 'common',
        color: '#8B5CF6',
        requirements: [{ type: 'posts_count', value: 10, description: 'Fazer 10 posts' }],
        is_active: true
      },
      {
        id: 'content_creator',
        name: 'Criadora de Conteúdo',
        description: 'Compartilhou 50 posts com a comunidade',
        icon: '✨',
        category: 'participation',
        rarity: 'rare',
        color: '#F59E0B',
        requirements: [{ type: 'posts_count', value: 50, description: 'Fazer 50 posts' }],
        is_active: true
      },
      {
        id: 'helpful_commenter',
        name: 'Comentadora Apoiadora',
        description: 'Deixou 25 comentários em posts de outras mães',
        icon: '💬',
        category: 'participation',
        rarity: 'common',
        color: '#06B6D4',
        requirements: [{ type: 'comments_count', value: 25, description: 'Fazer 25 comentários' }],
        is_active: true
      },
      {
        id: 'community_cheerleader',
        name: 'Torcedora da Comunidade',
        description: 'Deixou 100 comentários apoiadores',
        icon: '🎉',
        category: 'participation',
        rarity: 'rare',
        color: '#EF4444',
        requirements: [{ type: 'comments_count', value: 100, description: 'Fazer 100 comentários' }],
        is_active: true
      },

      // FÉ
      {
        id: 'first_prayer',
        name: 'Primeira Oração',
        description: 'Compartilhou sua primeira oração com a comunidade',
        icon: '🙏',
        category: 'faith',
        rarity: 'common',
        color: '#10B981',
        requirements: [{ type: 'prayers_shared', value: 1, description: 'Compartilhar 1 oração' }],
        is_active: true
      },
      {
        id: 'prayer_warrior',
        name: 'Guerreira da Oração',
        description: 'Compartilhou 10 orações com a comunidade',
        icon: '⚔️',
        category: 'faith',
        rarity: 'rare',
        color: '#8B5CF6',
        requirements: [{ type: 'prayers_shared', value: 10, description: 'Compartilhar 10 orações' }],
        is_active: true
      },
      {
        id: 'intercessor',
        name: 'Intercessora',
        description: 'Compartilhou 25 orações e disse 50 améns',
        icon: '🤲',
        category: 'faith',
        rarity: 'epic',
        color: '#F59E0B',
        requirements: [
          { type: 'prayers_shared', value: 25, description: 'Compartilhar 25 orações' },
          { type: 'special', value: 50, description: 'Dizer 50 améns', metric: 'prayer_amens' }
        ],
        is_active: true
      },
      {
        id: 'faith_journaler',
        name: 'Jornalista da Fé',
        description: 'Escreveu 7 entradas de journal com prompts espirituais',
        icon: '📖',
        category: 'faith',
        rarity: 'rare',
        color: '#06B6D4',
        requirements: [{ type: 'journal_entries', value: 7, description: '7 entradas de journal' }],
        is_active: true
      },

      // APOIO
      {
        id: 'first_like',
        name: 'Primeira Curtida',
        description: 'Curtiu seu primeiro post de outra mãe',
        icon: '❤️',
        category: 'support',
        rarity: 'common',
        color: '#EF4444',
        requirements: [{ type: 'special', value: 1, description: 'Dar 1 curtida', metric: 'likes_given' }],
        is_active: true
      },
      {
        id: 'supportive_friend',
        name: 'Amiga Apoiadora',
        description: 'Curtiu 50 posts de outras mães',
        icon: '🤗',
        category: 'support',
        rarity: 'common',
        color: '#8B5CF6',
        requirements: [{ type: 'special', value: 50, description: 'Dar 50 curtidas', metric: 'likes_given' }],
        is_active: true
      },
      {
        id: 'community_angel',
        name: 'Anjo da Comunidade',
        description: 'Curtiu 200 posts e deixou 50 comentários',
        icon: '👼',
        category: 'support',
        rarity: 'rare',
        color: '#F59E0B',
        requirements: [
          { type: 'special', value: 200, description: 'Dar 200 curtidas', metric: 'likes_given' },
          { type: 'comments_count', value: 50, description: 'Fazer 50 comentários' }
        ],
        is_active: true
      },
      {
        id: 'prayer_supporter',
        name: 'Apoiadora em Oração',
        description: 'Disse amém em 25 orações de outras mães',
        icon: '🙌',
        category: 'support',
        rarity: 'rare',
        color: '#10B981',
        requirements: [{ type: 'special', value: 25, description: 'Dizer 25 améns', metric: 'prayer_amens' }],
        is_active: true
      },

      // JORNADA
      {
        id: 'early_bird',
        name: 'Madrugadora',
        description: 'Ativa no app por 7 dias consecutivos',
        icon: '🌅',
        category: 'journey',
        rarity: 'common',
        color: '#F59E0B',
        requirements: [{ type: 'streak_days', value: 7, description: '7 dias consecutivos ativa' }],
        is_active: true
      },
      {
        id: 'dedicated_mom',
        name: 'Mãe Dedicada',
        description: 'Ativa no app por 30 dias consecutivos',
        icon: '💪',
        category: 'journey',
        rarity: 'rare',
        color: '#8B5CF6',
        requirements: [{ type: 'streak_days', value: 30, description: '30 dias consecutivos ativa' }],
        is_active: true
      },
      {
        id: 'journal_keeper',
        name: 'Guardiã do Journal',
        description: 'Manteve um journal por 14 dias consecutivos',
        icon: '📔',
        category: 'journey',
        rarity: 'rare',
        color: '#06B6D4',
        requirements: [{ type: 'special', value: 14, description: '14 dias de journal', metric: 'journal_streak' }],
        is_active: true
      },
      {
        id: 'clubnath_veteran',
        name: 'Veterana do ClubNath',
        description: 'Membro ativa por 90 dias',
        icon: '🏆',
        category: 'journey',
        rarity: 'epic',
        color: '#F59E0B',
        requirements: [{ type: 'days_active', value: 90, description: '90 dias ativa' }],
        is_active: true
      },

      // ESPECIAIS
      {
        id: 'nath_approved',
        name: 'Nathy Aprovou',
        description: 'Teve um post destacado pela Nath',
        icon: '👑',
        category: 'special',
        rarity: 'legendary',
        color: '#F59E0B',
        requirements: [{ type: 'special', value: 1, description: 'Post aprovado pela Nath', metric: 'nath_approved' }],
        is_active: true
      },
      {
        id: 'early_adopter',
        name: 'Pioneira',
        description: 'Uma das primeiras 100 membros do ClubNath',
        icon: '🚀',
        category: 'special',
        rarity: 'legendary',
        color: '#8B5CF6',
        requirements: [{ type: 'special', value: 100, description: 'Entre as primeiras 100', metric: 'early_member' }],
        is_active: true
      }
    ];
  }

  // =====================================================
  // CRUD OPERATIONS
  // =====================================================

  async getAllBadges(): Promise<Badge[]> {
    // Por enquanto, retornar badges hardcoded
    // Em produção, buscar do banco de dados
    return this.getBadgeDefinitions();
  }

  async getBadgeById(badgeId: string): Promise<Badge | null> {
    const badges = this.getBadgeDefinitions();
    return badges.find(badge => badge.id === badgeId) || null;
  }

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        *,
        badge:badges(*)
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar badges do usuário:', error);
      return [];
    }

    return data || [];
  }

  async getUserBadgeProgress(userId: string): Promise<BadgeProgress[]> {
    const badges = this.getBadgeDefinitions();
    const userBadges = await this.getUserBadges(userId);
    const earnedBadgeIds = new Set(userBadges.map(ub => ub.badge_id));

    const progressPromises = badges.map(async (badge) => {
      const progress = await this.calculateBadgeProgress(userId, badge);
      const userBadge = userBadges.find(ub => ub.badge_id === badge.id);

      return {
        badge_id: badge.id,
        badge_name: badge.name,
        progress: progress,
        requirements: badge.requirements,
        is_earned: earnedBadgeIds.has(badge.id),
        earned_at: userBadge?.earned_at
      };
    });

    return Promise.all(progressPromises);
  }

  async earnBadge(userId: string, badgeId: string): Promise<boolean> {
    // Verificar se já tem a badge
    const existingBadge = await supabase
      .from('user_badges')
      .select('id')
      .eq('user_id', userId)
      .eq('badge_id', badgeId)
      .single();

    if (existingBadge.data) {
      return false; // Já tem a badge
    }

    // Adicionar badge
    const { error } = await supabase
      .from('user_badges')
      .insert({
        user_id: userId,
        badge_id: badgeId,
        earned_at: new Date().toISOString(),
        progress: 100,
        is_earned: true
      });

    if (error) {
      console.error('Erro ao adicionar badge:', error);
      return false;
    }

    // Enviar notificação
    await this.notifyBadgeEarned(userId, badgeId);

    return true;
  }

  // =====================================================
  // PROGRESS CALCULATION
  // =====================================================

  private async calculateBadgeProgress(userId: string, badge: Badge): Promise<number> {
    const requirements = badge.requirements;
    let totalProgress = 0;

    for (const requirement of requirements) {
      const progress = await this.calculateRequirementProgress(userId, requirement);
      totalProgress += progress;
    }

    return Math.min(100, Math.round(totalProgress / requirements.length));
  }

  private async calculateRequirementProgress(userId: string, requirement: BadgeRequirement): Promise<number> {
    switch (requirement.type) {
      case 'posts_count':
        const { count: postsCount } = await supabase
          .from('posts')
          .select('id', { count: 'exact' })
          .eq('author_id', userId);
        return Math.min(100, ((postsCount || 0) / requirement.value) * 100);

      case 'comments_count':
        const { count: commentsCount } = await supabase
          .from('comments')
          .select('id', { count: 'exact' })
          .eq('user_id', userId);
        return Math.min(100, ((commentsCount || 0) / requirement.value) * 100);

      case 'prayers_shared':
        const { count: prayersCount } = await supabase
          .from('prayer_posts')
          .select('id', { count: 'exact' })
          .eq('user_id', userId);
        return Math.min(100, ((prayersCount || 0) / requirement.value) * 100);

      case 'journal_entries':
        const { count: journalCount } = await supabase
          .from('journal_entries')
          .select('id', { count: 'exact' })
          .eq('user_id', userId);
        return Math.min(100, ((journalCount || 0) / requirement.value) * 100);

      case 'days_active':
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('created_at')
          .eq('id', userId)
          .single();
        
        if (userProfile) {
          const daysSinceJoin = Math.floor(
            (Date.now() - new Date(userProfile.created_at).getTime()) / (1000 * 60 * 60 * 24)
          );
          return Math.min(100, (daysSinceJoin / requirement.value) * 100);
        }
        return 0;

      case 'streak_days':
        const { data: streakData } = await supabase
          .from('user_journal_streaks')
          .select('current_streak')
          .eq('user_id', userId)
          .single();
        
        const currentStreak = streakData?.current_streak || 0;
        return Math.min(100, (currentStreak / requirement.value) * 100);

      case 'special':
        return await this.calculateSpecialRequirement(userId, requirement);

      default:
        return 0;
    }
  }

  private async calculateSpecialRequirement(userId: string, requirement: BadgeRequirement): Promise<number> {
    switch (requirement.metric) {
      case 'likes_given':
        const { count: likesGiven } = await supabase
          .from('post_likes')
          .select('id', { count: 'exact' })
          .eq('user_id', userId);
        return Math.min(100, ((likesGiven || 0) / requirement.value) * 100);

      case 'prayer_amens':
        const { count: amensGiven } = await supabase
          .from('prayer_amens')
          .select('id', { count: 'exact' })
          .eq('user_id', userId);
        return Math.min(100, ((amensGiven || 0) / requirement.value) * 100);

      case 'journal_streak':
        const { data: journalStreak } = await supabase
          .from('user_journal_streaks')
          .select('current_streak')
          .eq('user_id', userId)
          .single();
        
        const journalCurrentStreak = journalStreak?.current_streak || 0;
        return Math.min(100, (journalCurrentStreak / requirement.value) * 100);

      case 'nath_approved':
        const { count: nathApproved } = await supabase
          .from('posts')
          .select('id', { count: 'exact' })
          .eq('author_id', userId)
          .eq('nathy_aproved', true);
        return (nathApproved || 0) > 0 ? 100 : 0;

      case 'early_member':
        // Verificar se está entre as primeiras 100 usuárias
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('created_at')
          .eq('id', userId)
          .single();
        
        if (userProfile) {
          const { count: earlierUsers } = await supabase
            .from('profiles')
            .select('id', { count: 'exact' })
            .lt('created_at', userProfile.created_at);
          
          return (earlierUsers || 0) < 100 ? 100 : 0;
        }
        return 0;

      default:
        return 0;
    }
  }

  // =====================================================
  // BADGE CHECKING AND AWARDING
  // =====================================================

  async checkAndAwardBadges(userId: string, action: {
    type: 'post_created' | 'comment_created' | 'like_given' | 'prayer_shared' | 'journal_entry' | 'login';
    data?: any;
  }): Promise<string[]> {
    const badges = this.getBadgeDefinitions();
    const earnedBadges: string[] = [];

    for (const badge of badges) {
      const progress = await this.calculateBadgeProgress(userId, badge);
      
      if (progress >= 100) {
        const earned = await this.earnBadge(userId, badge.id);
        if (earned) {
          earnedBadges.push(badge.id);
        }
      }
    }

    return earnedBadges;
  }

  // =====================================================
  // STATISTICS
  // =====================================================

  async getBadgeStats(userId: string): Promise<BadgeStats> {
    const badges = this.getBadgeDefinitions();
    const userBadges = await this.getUserBadges(userId);
    const progress = await this.getUserBadgeProgress(userId);

    const earnedBadgeIds = new Set(userBadges.map(ub => ub.badge_id));
    const progressBadges = progress.filter(p => !p.is_earned && p.progress > 0);

    const stats: BadgeStats = {
      total_badges: badges.length,
      earned_badges: userBadges.length,
      progress_badges: progressBadges.length,
      rare_badges: userBadges.filter(ub => ub.badge?.rarity === 'rare').length,
      epic_badges: userBadges.filter(ub => ub.badge?.rarity === 'epic').length,
      legendary_badges: userBadges.filter(ub => ub.badge?.rarity === 'legendary').length,
      recent_earned: userBadges
        .sort((a, b) => new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime())
        .slice(0, 5)
        .map(ub => ub.badge!)
        .filter(Boolean),
      next_achievable: progressBadges
        .sort((a, b) => b.progress - a.progress)
        .slice(0, 3)
        .map(p => badges.find(b => b.id === p.badge_id)!)
        .filter(Boolean)
    };

    return stats;
  }

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  private async notifyBadgeEarned(userId: string, badgeId: string): Promise<void> {
    const badge = await this.getBadgeById(badgeId);
    if (!badge) return;

    const { notificationsService } = await import('./notifications.service');
    
    await notificationsService.sendNotification('badge_earned', userId, {
      badge_id: badgeId,
      badge_name: badge.name,
      badge_icon: badge.icon,
      badge_rarity: badge.rarity,
      body: `Parabéns! Você conquistou a badge "${badge.name}"! ${badge.icon}`
    });
  }

  // =====================================================
  // LEADERBOARD
  // =====================================================

  async getBadgeLeaderboard(limit: number = 10): Promise<Array<{
    user_id: string;
    full_name: string;
    total_badges: number;
    rare_badges: number;
    epic_badges: number;
    legendary_badges: number;
  }>> {
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        user_id,
        badge:badges(rarity),
        user:profiles!user_badges_user_id_fkey(full_name)
      `);

    if (error) {
      console.error('Erro ao buscar leaderboard:', error);
      return [];
    }

    // Agrupar por usuário
    const userStats = new Map<string, {
      user_id: string;
      full_name: string;
      total_badges: number;
      rare_badges: number;
      epic_badges: number;
      legendary_badges: number;
    }>();

    data?.forEach(item => {
      const userId = item.user_id;
      const rarity = item.badge?.rarity;
      const fullName = item.user?.full_name || 'Usuário';

      if (!userStats.has(userId)) {
        userStats.set(userId, {
          user_id: userId,
          full_name: fullName,
          total_badges: 0,
          rare_badges: 0,
          epic_badges: 0,
          legendary_badges: 0
        });
      }

      const stats = userStats.get(userId)!;
      stats.total_badges++;

      switch (rarity) {
        case 'rare':
          stats.rare_badges++;
          break;
        case 'epic':
          stats.epic_badges++;
          break;
        case 'legendary':
          stats.legendary_badges++;
          break;
      }
    });

    return Array.from(userStats.values())
      .sort((a, b) => {
        // Ordenar por badges lendárias primeiro, depois épicas, depois raras, depois total
        if (a.legendary_badges !== b.legendary_badges) {
          return b.legendary_badges - a.legendary_badges;
        }
        if (a.epic_badges !== b.epic_badges) {
          return b.epic_badges - a.epic_badges;
        }
        if (a.rare_badges !== b.rare_badges) {
          return b.rare_badges - a.rare_badges;
        }
        return b.total_badges - a.total_badges;
      })
      .slice(0, limit);
  }
}

// Exportar instância singleton
export const badgesService = BadgesService.getInstance();
export default badgesService;