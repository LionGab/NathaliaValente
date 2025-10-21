import { supabase } from '@/lib/supabase';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'engagement' | 'milestone' | 'special' | 'community';
  requirements: {
    type: 'likes' | 'comments' | 'posts' | 'days_active' | 'special';
    value: number;
    description: string;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  progress?: number;
  badge?: Badge;
}

export interface BadgeProgress {
  badge_id: string;
  current: number;
  required: number;
  percentage: number;
  badge: Badge;
}

// Badges predefinidos
export const PREDEFINED_BADGES: Omit<Badge, 'id' | 'created_at'>[] = [
  {
    name: 'Primeira Postagem',
    description: 'Parabéns pela sua primeira postagem no ClubNath!',
    icon: '🌟',
    color: '#FFD700',
    category: 'milestone',
    requirements: {
      type: 'posts',
      value: 1,
      description: 'Faça sua primeira postagem'
    },
    rarity: 'common'
  },
  {
    name: 'Social Butterfly',
    description: 'Você é uma borboleta social! Continue interagindo!',
    icon: '🦋',
    color: '#FF69B4',
    category: 'engagement',
    requirements: {
      type: 'comments',
      value: 50,
      description: 'Faça 50 comentários'
    },
    rarity: 'rare'
  },
  {
    name: 'Influencer',
    description: 'Suas postagens são um sucesso!',
    icon: '📈',
    color: '#8A2BE2',
    category: 'engagement',
    requirements: {
      type: 'likes',
      value: 1000,
      description: 'Receba 1000 likes no total'
    },
    rarity: 'epic'
  },
  {
    name: 'Membro Fiel',
    description: 'Você é um membro fiel da comunidade!',
    icon: '💎',
    color: '#00CED1',
    category: 'milestone',
    requirements: {
      type: 'days_active',
      value: 30,
      description: 'Seja ativo por 30 dias'
    },
    rarity: 'rare'
  },
  {
    name: 'Nathy Badge',
    description: 'Badge especial da Nath!',
    icon: '👑',
    color: '#FF1493',
    category: 'special',
    requirements: {
      type: 'special',
      value: 1,
      description: 'Badge especial da Nath'
    },
    rarity: 'legendary'
  },
  {
    name: 'Mentora',
    description: 'Você ajuda outras mães com suas dicas!',
    icon: '🤱',
    color: '#32CD32',
    category: 'community',
    requirements: {
      type: 'posts',
      value: 20,
      description: 'Faça 20 postagens na categoria "Dica de mãe"'
    },
    rarity: 'epic'
  },
  {
    name: 'Fé Forte',
    description: 'Sua fé inspira outras mães!',
    icon: '🙏',
    color: '#FF8C00',
    category: 'community',
    requirements: {
      type: 'posts',
      value: 15,
      description: 'Faça 15 postagens na categoria "Fé"'
    },
    rarity: 'rare'
  },
  {
    name: 'Estilo Próprio',
    description: 'Você tem um estilo único!',
    icon: '✨',
    color: '#9370DB',
    category: 'community',
    requirements: {
      type: 'posts',
      value: 10,
      description: 'Faça 10 postagens na categoria "Look do dia"'
    },
    rarity: 'rare'
  }
];

// Inicializar badges no banco
export const initializeBadges = async () => {
  try {
    // Verificar se já existem badges
    const { data: existingBadges } = await supabase
      .from('badges')
      .select('id')
      .limit(1);

    if (existingBadges && existingBadges.length > 0) {
      return; // Badges já inicializados
    }

    // Inserir badges predefinidos
    const { error } = await supabase
      .from('badges')
      .insert(PREDEFINED_BADGES);

    if (error) {
      console.error('Erro ao inicializar badges:', error);
    } else {
      console.log('Badges inicializados com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao inicializar badges:', error);
  }
};

// Buscar todos os badges
export const getAllBadges = async (): Promise<Badge[]> => {
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Erro ao buscar badges:', error);
    return [];
  }

  return data || [];
};

// Buscar badges do usuário
export const getUserBadges = async (userId: string): Promise<UserBadge[]> => {
  const { data, error } = await supabase
    .from('user_badges')
    .select(`
      *,
      badge:badge_id (*)
    `)
    .eq('user_id', userId)
    .order('earned_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar badges do usuário:', error);
    return [];
  }

  return data || [];
};

// Buscar progresso dos badges do usuário
export const getUserBadgeProgress = async (userId: string): Promise<BadgeProgress[]> => {
  try {
    // Buscar todos os badges
    const badges = await getAllBadges();
    
    // Buscar badges já conquistados
    const userBadges = await getUserBadges(userId);
    const earnedBadgeIds = new Set(userBadges.map(ub => ub.badge_id));

    // Buscar estatísticas do usuário
    const [postsResult, commentsResult, likesResult] = await Promise.all([
      supabase
        .from('posts')
        .select('id, category, created_at')
        .eq('user_id', userId),
      supabase
        .from('comments')
        .select('id')
        .eq('user_id', userId),
      supabase
        .from('likes')
        .select('post_id, posts!inner(user_id)')
        .eq('posts.user_id', userId)
    ]);

    const userPosts = postsResult.data || [];
    const userComments = commentsResult.data || [];
    const userLikes = likesResult.data || [];

    // Calcular dias ativos
    const activeDays = new Set(
      userPosts.map(post => new Date(post.created_at).toDateString())
    ).size;

    // Calcular progresso para cada badge
    const progress: BadgeProgress[] = badges
      .filter(badge => !earnedBadgeIds.has(badge.id))
      .map(badge => {
        let current = 0;
        let required = badge.requirements.value;

        switch (badge.requirements.type) {
          case 'posts':
            if (badge.name === 'Mentora') {
              current = userPosts.filter(p => p.category === 'Dica de mãe').length;
            } else if (badge.name === 'Fé Forte') {
              current = userPosts.filter(p => p.category === 'Fé').length;
            } else if (badge.name === 'Estilo Próprio') {
              current = userPosts.filter(p => p.category === 'Look do dia').length;
            } else {
              current = userPosts.length;
            }
            break;
          case 'comments':
            current = userComments.length;
            break;
          case 'likes':
            current = userLikes.length;
            break;
          case 'days_active':
            current = activeDays;
            break;
          case 'special':
            // Badges especiais são concedidos manualmente
            current = 0;
            break;
        }

        return {
          badge_id: badge.id,
          current: Math.min(current, required),
          required,
          percentage: Math.round((current / required) * 100),
          badge
        };
      })
      .filter(p => p.percentage > 0) // Só mostrar badges com progresso
      .sort((a, b) => b.percentage - a.percentage);

    return progress;
  } catch (error) {
    console.error('Erro ao calcular progresso dos badges:', error);
    return [];
  }
};

// Verificar e conceder badges automaticamente
export const checkAndAwardBadges = async (userId: string) => {
  try {
    const progress = await getUserBadgeProgress(userId);
    const badgesToAward = progress.filter(p => p.percentage >= 100);

    if (badgesToAward.length === 0) return [];

    const newBadges = [];
    for (const progressItem of badgesToAward) {
      const { error } = await supabase
        .from('user_badges')
        .insert({
          user_id: userId,
          badge_id: progressItem.badge_id,
          earned_at: new Date().toISOString()
        });

      if (!error) {
        newBadges.push(progressItem.badge);
      }
    }

    return newBadges;
  } catch (error) {
    console.error('Erro ao conceder badges:', error);
    return [];
  }
};

// Conceder badge especial (Nathy Badge)
export const awardSpecialBadge = async (userId: string, badgeId: string) => {
  try {
    const { error } = await supabase
      .from('user_badges')
      .insert({
        user_id: userId,
        badge_id: badgeId,
        earned_at: new Date().toISOString()
      });

    if (error) {
      console.error('Erro ao conceder badge especial:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao conceder badge especial:', error);
    return false;
  }
};

// Buscar badge por ID
export const getBadgeById = async (badgeId: string): Promise<Badge | null> => {
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .eq('id', badgeId)
    .single();

  if (error) {
    console.error('Erro ao buscar badge:', error);
    return null;
  }

  return data;
};
