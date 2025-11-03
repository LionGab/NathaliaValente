/**
 * Groups Mock Service
 * Serviço com dados mockados realistas para grupos temáticos
 */

export interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  emoji: string;
  memberCount: number;
  isPrivate: boolean;
  isJoined: boolean;
  recentActivity: string;
  lastActivity: string;
  tags: string[];
  createdBy: {
    name: string;
    avatar: string;
  };
  featured: boolean;
}

export interface GroupPost {
  id: string;
  groupId: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  timestamp: string;
  category: string;
}

// Dados mockados realistas para grupos
const mockGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Mães de Primeira Viagem',
    description:
      'Um espaço seguro para mães que estão vivendo a maternidade pela primeira vez. Compartilhe dúvidas, medos e alegrias!',
    category: 'Pós-Parto',
    emoji: '👶',
    memberCount: 1247,
    isPrivate: false,
    isJoined: true,
    recentActivity: 'Maria compartilhou uma conquista',
    lastActivity: '2h atrás',
    tags: ['primeira-vez', 'dúvidas', 'apoio', 'comunidade'],
    createdBy: {
      name: 'Ana Costa',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    featured: true,
  },
  {
    id: 'group-2',
    name: 'Amamentação com Amor',
    description:
      'Trocando experiências sobre amamentação, dificuldades e conquistas. Juntas somos mais fortes!',
    category: 'Amamentação',
    emoji: '🤱',
    memberCount: 892,
    isPrivate: false,
    isJoined: true,
    recentActivity: 'Carla fez uma pergunta sobre produção de leite',
    lastActivity: '1h atrás',
    tags: ['amamentação', 'leite-materno', 'dificuldades', 'conquistas'],
    createdBy: {
      name: 'Carla Mendes',
      avatar:
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    },
    featured: true,
  },
  {
    id: 'group-3',
    name: 'Mães Solo - Juntas Somos Mais',
    description:
      'Para mães que criam seus filhos sozinhas. Um espaço de apoio, dicas práticas e muito carinho.',
    category: 'Mães Solo',
    emoji: '💪',
    memberCount: 634,
    isPrivate: false,
    isJoined: false,
    recentActivity: 'Joana compartilhou dicas de organização',
    lastActivity: '3h atrás',
    tags: ['mães-solo', 'apoio', 'organização', 'força'],
    createdBy: {
      name: 'Joana Silva',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    featured: false,
  },
  {
    id: 'group-4',
    name: 'Criação com Fé',
    description:
      'Mães cristãs compartilhando valores, orações e momentos de fé na criação dos filhos.',
    category: 'Fé',
    emoji: '🙏',
    memberCount: 1156,
    isPrivate: false,
    isJoined: true,
    recentActivity: 'Patrícia compartilhou um versículo',
    lastActivity: '30min atrás',
    tags: ['fé', 'cristianismo', 'valores', 'oração'],
    createdBy: {
      name: 'Patrícia Santos',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    },
    featured: true,
  },
  {
    id: 'group-5',
    name: 'Bem-estar Materno',
    description:
      'Cuidando de nós mesmas para cuidar melhor dos nossos filhos. Exercícios, alimentação e autocuidado.',
    category: 'Bem-estar',
    emoji: '💚',
    memberCount: 743,
    isPrivate: false,
    isJoined: false,
    recentActivity: 'Fernanda compartilhou uma receita saudável',
    lastActivity: '4h atrás',
    tags: ['bem-estar', 'exercício', 'alimentação', 'autocuidado'],
    createdBy: {
      name: 'Fernanda Lima',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    },
    featured: false,
  },
  {
    id: 'group-6',
    name: 'Educação em Casa',
    description:
      'Mães que escolheram educar seus filhos em casa. Compartilhando métodos, materiais e experiências.',
    category: 'Educação',
    emoji: '📚',
    memberCount: 445,
    isPrivate: true,
    isJoined: false,
    recentActivity: 'Lucia compartilhou atividades educativas',
    lastActivity: '5h atrás',
    tags: ['homeschooling', 'educação', 'aprendizado', 'métodos'],
    createdBy: {
      name: 'Lucia Oliveira',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    featured: false,
  },
  {
    id: 'group-7',
    name: 'Relacionamento em Família',
    description:
      'Conversando sobre casamento, relacionamento e como manter o amor vivo após a chegada dos filhos.',
    category: 'Relacionamentos',
    emoji: '💕',
    memberCount: 567,
    isPrivate: false,
    isJoined: true,
    recentActivity: 'Mariana fez uma pergunta sobre intimidade',
    lastActivity: '6h atrás',
    tags: ['casamento', 'relacionamento', 'intimidade', 'família'],
    createdBy: {
      name: 'Mariana Costa',
      avatar:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    },
    featured: false,
  },
  {
    id: 'group-8',
    name: 'Mães Empreendedoras',
    description:
      'Mães que decidiram empreender para ter mais tempo com os filhos. Networking, dicas e apoio mútuo.',
    category: 'Carreira',
    emoji: '💼',
    memberCount: 789,
    isPrivate: false,
    isJoined: false,
    recentActivity: 'Roberta compartilhou uma oportunidade',
    lastActivity: '7h atrás',
    tags: ['empreendedorismo', 'negócios', 'networking', 'carreira'],
    createdBy: {
      name: 'Roberta Alves',
      avatar:
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop&crop=face',
    },
    featured: true,
  },
  {
    id: 'group-9',
    name: 'Criação Natural',
    description:
      'Mães que optam por uma criação mais natural, com foco em produtos orgânicos e métodos alternativos.',
    category: 'Criação',
    emoji: '🌱',
    memberCount: 334,
    isPrivate: true,
    isJoined: false,
    recentActivity: 'Camila compartilhou uma receita natural',
    lastActivity: '8h atrás',
    tags: ['natural', 'orgânico', 'alternativo', 'sustentável'],
    createdBy: {
      name: 'Camila Rocha',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    },
    featured: false,
  },
  {
    id: 'group-10',
    name: 'Mães de Crianças Especiais',
    description:
      'Um espaço especial para mães de crianças com necessidades especiais. Apoio, informações e muito amor.',
    category: 'Outros',
    emoji: '🌟',
    memberCount: 223,
    isPrivate: true,
    isJoined: false,
    recentActivity: 'Sandra compartilhou uma conquista do filho',
    lastActivity: '9h atrás',
    tags: ['especiais', 'apoio', 'informações', 'amor'],
    createdBy: {
      name: 'Sandra Pereira',
      avatar:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    },
    featured: false,
  },
];

// Posts mockados para os grupos
const mockGroupPosts: GroupPost[] = [
  {
    id: 'post-1',
    groupId: 'group-1',
    author: {
      name: 'Maria Silva',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    content:
      'Meninas, consegui fazer meu bebê dormir a noite toda! 🎉 Foi difícil, mas com paciência e rotina conseguimos. Para quem está passando por isso: não desistam! 💪',
    likes: 23,
    comments: 8,
    timestamp: '2h atrás',
    category: 'Conquista',
  },
  {
    id: 'post-2',
    groupId: 'group-2',
    author: {
      name: 'Carla Mendes',
      avatar:
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    },
    content:
      'Alguém mais teve dificuldade com a produção de leite? Estou preocupada porque parece que está diminuindo. Alguma dica? 🤱',
    likes: 15,
    comments: 12,
    timestamp: '1h atrás',
    category: 'Dúvida',
  },
  {
    id: 'post-3',
    groupId: 'group-4',
    author: {
      name: 'Patrícia Santos',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    },
    content:
      'Versículo do dia: "Ensina a criança no caminho em que deve andar, e ainda quando for velho não se desviará dele." Provérbios 22:6 🙏 Como vocês têm ensinado valores cristãos para seus filhos?',
    likes: 31,
    comments: 15,
    timestamp: '30min atrás',
    category: 'Espiritual',
  },
  {
    id: 'post-4',
    groupId: 'group-7',
    author: {
      name: 'Mariana Costa',
      avatar:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    },
    content:
      'Meninas, como vocês mantêm a intimidade no casamento depois dos filhos? Às vezes sinto que estamos muito focados nas crianças e esquecemos de nós dois. 💕',
    likes: 19,
    comments: 9,
    timestamp: '6h atrás',
    category: 'Relacionamento',
  },
  {
    id: 'post-5',
    groupId: 'group-8',
    author: {
      name: 'Roberta Alves',
      avatar:
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop&crop=face',
    },
    content:
      'Compartilhando uma oportunidade incrível! 🚀 Uma empresa está procurando mães para trabalhar de casa. Interessadas me chamem no privado!',
    likes: 27,
    comments: 6,
    timestamp: '7h atrás',
    category: 'Oportunidade',
  },
];

export const groupsMockService = {
  // Buscar todos os grupos
  async getAllGroups(): Promise<Group[]> {
    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockGroups;
  },

  // Buscar grupos por categoria
  async getGroupsByCategory(category: string): Promise<Group[]> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockGroups.filter((group) => group.category === category);
  },

  // Buscar grupos populares
  async getPopularGroups(): Promise<Group[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockGroups.sort((a, b) => b.memberCount - a.memberCount).slice(0, 6);
  },

  // Buscar grupos recentes
  async getRecentGroups(): Promise<Group[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockGroups
      .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
      .slice(0, 6);
  },

  // Buscar grupos por texto
  async searchGroups(query: string): Promise<Group[]> {
    await new Promise((resolve) => setTimeout(resolve, 700));
    const lowerQuery = query.toLowerCase();
    return mockGroups.filter(
      (group) =>
        group.name.toLowerCase().includes(lowerQuery) ||
        group.description.toLowerCase().includes(lowerQuery) ||
        group.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  },

  // Buscar grupos privados
  async getPrivateGroups(): Promise<Group[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockGroups.filter((group) => group.isPrivate);
  },

  // Entrar em um grupo
  async joinGroup(groupId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const group = mockGroups.find((g) => g.id === groupId);
    if (group) {
      group.isJoined = true;
      group.memberCount += 1;
      return true;
    }
    return false;
  },

  // Sair de um grupo
  async leaveGroup(groupId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const group = mockGroups.find((g) => g.id === groupId);
    if (group) {
      group.isJoined = false;
      group.memberCount = Math.max(0, group.memberCount - 1);
      return true;
    }
    return false;
  },

  // Buscar posts de um grupo
  async getGroupPosts(groupId: string): Promise<GroupPost[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockGroupPosts.filter((post) => post.groupId === groupId);
  },

  // Criar novo grupo
  async createGroup(groupData: Partial<Group>): Promise<Group> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name: groupData.name || 'Novo Grupo',
      description: groupData.description || 'Descrição do grupo',
      category: groupData.category || 'Outros',
      emoji: groupData.emoji || '🌟',
      memberCount: 1,
      isPrivate: groupData.isPrivate || false,
      isJoined: true,
      recentActivity: 'Grupo criado',
      lastActivity: 'Agora',
      tags: groupData.tags || [],
      createdBy: groupData.createdBy || {
        name: 'Usuário',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      },
      featured: false,
    };

    mockGroups.unshift(newGroup);
    return newGroup;
  },
};
