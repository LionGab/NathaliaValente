import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Filter,
  Search,
  Plus,
  Calendar,
  MapPin,
  Clock,
  User,
  Star,
  TrendingUp,
  Shield,
  Eye,
  Lock
} from 'lucide-react';

interface CommunityPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    level: number;
  };
  content: {
    text: string;
    images?: string[];
    category: string;
    tags: string[];
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
  isPinned: boolean;
  group?: {
    id: string;
    name: string;
    type: 'public' | 'private' | 'verified';
    memberCount: number;
  };
}

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'verified';
  memberCount: number;
  postCount: number;
  category: string;
  icon: string;
  color: string;
  rules: string[];
  moderators: string[];
  isJoined: boolean;
  lastActivity: string;
}

const mockGroups: CommunityGroup[] = [
  {
    id: '1',
    name: 'Gravidez & Gestação',
    description: 'Compartilhe sua jornada da gravidez com outras mães',
    type: 'public',
    memberCount: 15420,
    postCount: 2847,
    category: 'Gravidez',
    icon: '🤱',
    color: 'from-pink-500 to-rose-500',
    rules: ['Respeite todas as mães', 'Não compartilhe informações médicas sem consultar um profissional'],
    moderators: ['Dr. Ana Costa', 'Maria Silva'],
    isJoined: true,
    lastActivity: '2 horas atrás'
  },
  {
    id: '2',
    name: 'Amamentação & Cuidados',
    description: 'Dicas, suporte e experiências sobre amamentação',
    type: 'verified',
    memberCount: 8932,
    postCount: 1523,
    category: 'Amamentação',
    icon: '🍼',
    color: 'from-blue-500 to-cyan-500',
    rules: ['Foque em experiências positivas', 'Seja respeitosa com diferentes opiniões'],
    moderators: ['Consultora Lactação', 'Enfermeira Obstétrica'],
    isJoined: true,
    lastActivity: '30 min atrás'
  },
  {
    id: '3',
    name: 'Pós-Parto & Recuperação',
    description: 'Apoio emocional e físico no período pós-parto',
    type: 'private',
    memberCount: 4567,
    postCount: 892,
    category: 'Pós-Parto',
    icon: '💪',
    color: 'from-purple-500 to-violet-500',
    rules: ['Mantenha confidencialidade', 'Seja empática e acolhedora'],
    moderators: ['Psicóloga Perinatal', 'Doula Patricia'],
    isJoined: false,
    lastActivity: '1 hora atrás'
  },
  {
    id: '4',
    name: 'Exercícios & Bem-estar',
    description: 'Atividades físicas seguras durante e após a gravidez',
    type: 'public',
    memberCount: 6789,
    postCount: 1234,
    category: 'Saúde',
    icon: '🏃‍♀️',
    color: 'from-green-500 to-emerald-500',
    rules: ['Consulte sempre um profissional', 'Compartilhe apenas exercícios seguros'],
    moderators: ['Prof. Maria Silva', 'Fisioterapeuta'],
    isJoined: true,
    lastActivity: '4 horas atrás'
  }
];

const mockPosts: CommunityPost[] = [
  {
    id: '1',
    author: {
      id: '1',
      name: 'Maria Silva',
      avatar: '/avatars/maria.jpg',
      verified: true,
      level: 5
    },
    content: {
      text: 'Meninas, estou no 8º mês e descobri alguns exercícios que estão me ajudando muito com as dores nas costas! Quem mais está passando por isso?',
      images: ['/images/exercicio-gravidez.jpg'],
      category: 'Gravidez',
      tags: ['exercícios', 'dores nas costas', '8º mês']
    },
    engagement: {
      likes: 45,
      comments: 12,
      shares: 8,
      views: 234
    },
    timestamp: '2 horas atrás',
    isLiked: false,
    isBookmarked: false,
    isPinned: false,
    group: {
      id: '1',
      name: 'Gravidez & Gestação',
      type: 'public',
      memberCount: 15420
    }
  },
  {
    id: '2',
    author: {
      id: '2',
      name: 'Ana Costa',
      avatar: '/avatars/ana.jpg',
      verified: true,
      level: 8
    },
    content: {
      text: 'Dica importante para as mamães de primeira viagem: a amamentação pode ser desafiadora nos primeiros dias, mas é normal! Não desistam, vocês são capazes! 💪',
      category: 'Amamentação',
      tags: ['primeira viagem', 'amamentação', 'dicas']
    },
    engagement: {
      likes: 89,
      comments: 23,
      shares: 15,
      views: 456
    },
    timestamp: '4 horas atrás',
    isLiked: true,
    isBookmarked: true,
    isPinned: true,
    group: {
      id: '2',
      name: 'Amamentação & Cuidados',
      type: 'verified',
      memberCount: 8932
    }
  }
];

const categories = ['Todos', 'Gravidez', 'Amamentação', 'Pós-Parto', 'Saúde', 'Exercícios', 'Emocional'];
const sortOptions = ['Mais recentes', 'Mais populares', 'Mais comentados', 'Mais curtidos'];

export const EnhancedCommunityForum: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [sortBy, setSortBy] = useState<string>('Mais recentes');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>(mockPosts);
  const [groups, setGroups] = useState<CommunityGroup[]>(mockGroups);

  const filteredPosts = posts.filter(post => {
    const matchesGroup = selectedGroup === 'all' || post.group?.id === selectedGroup;
    const matchesCategory = selectedCategory === 'Todos' || post.content.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      post.content.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesGroup && matchesCategory && matchesSearch;
  });

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            engagement: {
              ...post.engagement,
              likes: post.isLiked ? post.engagement.likes - 1 : post.engagement.likes + 1
            }
          }
        : post
    ));
  };

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const handleJoinGroup = (groupId: string) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { 
            ...group, 
            isJoined: !group.isJoined,
            memberCount: group.isJoined ? group.memberCount - 1 : group.memberCount + 1
          }
        : group
    ));
  };

  const getGroupIcon = (type: string) => {
    switch (type) {
      case 'public':
        return <Users className="w-4 h-4" />;
      case 'private':
        return <Lock className="w-4 h-4" />;
      case 'verified':
        return <Shield className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getGroupColor = (type: string) => {
    switch (type) {
      case 'public':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'private':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400';
      case 'verified':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Comunidade Nossa Maternidade
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Conecte-se com outras mães, compartilhe experiências e encontre apoio
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
          <label htmlFor="community-search" className="sr-only">
            Buscar na comunidade
          </label>
          <input
            id="community-search"
            type="text"
            placeholder="Buscar posts, grupos, tópicos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            aria-label="Buscar na comunidade"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-xl hover:bg-pink-200 dark:hover:bg-pink-900/30 transition-colors"
            aria-label={showFilters ? "Fechar filtros" : "Abrir filtros"}
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>

          <button
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all"
            aria-label="Criar novo post"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Post</span>
          </button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Group Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Grupo
                  </label>
                  <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    aria-label="Selecionar grupo"
                  >
                    <option value="all">Todos os grupos</option>
                    {groups.map(group => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Categoria
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    aria-label="Selecionar categoria"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Ordenar por
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    aria-label="Ordenar posts"
                  >
                    {sortOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Groups Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Grupos Temáticos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((group) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${group.color} flex items-center justify-center text-2xl`}>
                    {group.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white">
                      {group.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGroupColor(group.type)}`}>
                        {getGroupIcon(group.type)}
                        <span className="ml-1 capitalize">{group.type}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleJoinGroup(group.id)}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                    group.isJoined
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700'
                  }`}
                  aria-label={group.isJoined ? `Sair do grupo ${group.name}` : `Entrar no grupo ${group.name}`}
                >
                  {group.isJoined ? 'Sair' : 'Entrar'}
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {group.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {group.memberCount.toLocaleString()} membros
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {group.postCount.toLocaleString()} posts
                  </span>
                </div>
                <span>{group.lastActivity}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Posts Recentes
        </h2>
        
        {filteredPosts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
          >
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {post.author.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {post.author.name}
                    </h3>
                    {post.author.verified && (
                      <Shield className="w-4 h-4 text-blue-500" aria-label="Verificado" />
                    )}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Nível {post.author.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{post.timestamp}</span>
                    {post.group && (
                      <>
                        <span>•</span>
                        <span className="text-pink-600 dark:text-pink-400">
                          {post.group.name}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {post.isPinned && (
                  <span className="text-yellow-500" aria-label="Post fixado">
                    📌
                  </span>
                )}
                <button
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  aria-label="Mais opções"
                >
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <p className="text-gray-800 dark:text-white leading-relaxed mb-3">
                {post.content.text}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {post.content.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Post Images */}
            {post.content.images && (
              <div className="mb-4">
                <img
                  src={post.content.images[0]}
                  alt="Imagem do post"
                  className="w-full h-64 object-cover rounded-xl"
                />
              </div>
            )}

            {/* Engagement */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 transition-colors ${
                    post.isLiked 
                      ? 'text-pink-600 dark:text-pink-400' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400'
                  }`}
                  aria-label={post.isLiked ? 'Descurtir post' : 'Curtir post'}
                >
                  <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span>{post.engagement.likes}</span>
                </button>

                <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.engagement.comments}</span>
                </button>

                <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span>{post.engagement.shares}</span>
                </button>

                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span>{post.engagement.views}</span>
                </div>
              </div>

              <button
                onClick={() => handleBookmark(post.id)}
                className={`p-2 rounded-full transition-colors ${
                  post.isBookmarked 
                    ? 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20'
                }`}
                aria-label={post.isBookmarked ? 'Remover dos salvos' : 'Salvar post'}
              >
                <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Nenhum post encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Tente ajustar os filtros ou criar um novo post
          </p>
          <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all">
            Criar Primeiro Post
          </button>
        </div>
      )}
    </div>
  );
};
