import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Edit3, 
  Camera, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Settings,
  Shield,
  Star,
  Calendar,
  MapPin,
  Baby,
  Users,
  Award,
  TrendingUp,
  Plus,
  MoreHorizontal,
  Lock,
  Globe,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  Image as ImageIcon,
  Video,
  FileText
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  location: string;
  joinDate: Date;
  verified: boolean;
  level: number;
  xp: number;
  nextLevelXp: number;
  stats: {
    posts: number;
    followers: number;
    following: number;
    likes: number;
    comments: number;
  };
  badges: {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    earnedAt: Date;
  }[];
  preferences: {
    privacy: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showLocation: boolean;
    allowMessages: boolean;
  };
  milestones: {
    id: string;
    title: string;
    description: string;
    date: Date;
    type: 'pregnancy' | 'birth' | 'milestone' | 'achievement';
    image?: string;
    isPublic: boolean;
  }[];
  stories: {
    id: string;
    title: string;
    content: string;
    type: 'text' | 'image' | 'video';
    media?: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    isPublic: boolean;
    likes: number;
    comments: number;
    views: number;
  }[];
}

const mockProfile: UserProfile = {
  id: '1',
  name: 'Maria Silva',
  username: '@mariasilva',
  email: 'maria@email.com',
  avatar: '/avatars/maria.jpg',
  coverImage: '/images/cover-maria.jpg',
  bio: 'Mãe de primeira viagem, compartilhando minha jornada da maternidade. Aprendendo todos os dias e amando cada momento! 💕',
  location: 'São Paulo, SP',
  joinDate: new Date('2023-06-15'),
  verified: true,
  level: 8,
  xp: 2450,
  nextLevelXp: 3000,
  stats: {
    posts: 47,
    followers: 1234,
    following: 567,
    likes: 8920,
    comments: 234
  },
  badges: [
    {
      id: '1',
      name: 'Primeira Mãe',
      description: 'Completou o primeiro mês de gestação',
      icon: '🤱',
      color: 'from-pink-500 to-rose-500',
      earnedAt: new Date('2023-07-15')
    },
    {
      id: '2',
      name: 'Comunidade Ativa',
      description: 'Participou de 10 discussões na comunidade',
      icon: '💬',
      color: 'from-blue-500 to-cyan-500',
      earnedAt: new Date('2023-08-20')
    },
    {
      id: '3',
      name: 'Apoiadora',
      description: 'Ajudou 5 mães com conselhos úteis',
      icon: '💝',
      color: 'from-purple-500 to-violet-500',
      earnedAt: new Date('2023-09-10')
    }
  ],
  preferences: {
    privacy: 'public',
    showEmail: false,
    showLocation: true,
    allowMessages: true
  },
  milestones: [
    {
      id: '1',
      title: 'Primeiro ultrassom',
      description: 'Vendo meu bebê pela primeira vez! Coração batendo forte 💓',
      date: new Date('2023-07-20'),
      type: 'pregnancy',
      image: '/images/ultrassom-1.jpg',
      isPublic: true
    },
    {
      id: '2',
      title: 'Nascimento do João',
      description: 'Meu filho chegou ao mundo! 3.2kg, 48cm, saudável e lindo!',
      date: new Date('2024-01-15'),
      type: 'birth',
      image: '/images/nascimento-joao.jpg',
      isPublic: true
    },
    {
      id: '3',
      title: 'Primeiro sorriso',
      description: 'João sorriu pela primeira vez hoje! Meu coração derreteu ❤️',
      date: new Date('2024-02-10'),
      type: 'milestone',
      image: '/images/primeiro-sorriso.jpg',
      isPublic: true
    }
  ],
  stories: [
    {
      id: '1',
      title: 'Minha experiência com enjoos matinais',
      content: 'Nos primeiros 3 meses, os enjoos foram intensos. Descobri que comer pequenas porções a cada 2 horas ajudou muito. Também beber água com limão e chá de gengibre. O que funcionou para vocês?',
      type: 'text',
      tags: ['enjoo', 'primeiro trimestre', 'dicas'],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
      isPublic: true,
      likes: 45,
      comments: 12,
      views: 234
    },
    {
      id: '2',
      title: 'Preparando o quarto do bebê',
      content: 'Finalmente terminei de organizar o quartinho do João! Ficou lindo e aconchegante. Cada detalhe foi pensado com muito amor.',
      type: 'image',
      media: '/images/quarto-bebe.jpg',
      tags: ['quarto', 'decoração', 'preparação'],
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18'),
      isPublic: true,
      likes: 67,
      comments: 8,
      views: 456
    }
  ]
};

export const EnhancedProfileSection: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [activeTab, setActiveTab] = useState<'stories' | 'milestones' | 'badges' | 'stats'>('stories');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingStory, setEditingStory] = useState<string | null>(null);

  const progressPercentage = (profile.xp / profile.nextLevelXp) * 100;

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleTogglePrivacy = (storyId: string) => {
    setProfile(prev => ({
      ...prev,
      stories: prev.stories.map(story => 
        story.id === storyId 
          ? { ...story, isPublic: !story.isPublic }
          : story
      )
    }));
  };

  const handleDeleteStory = (storyId: string) => {
    setProfile(prev => ({
      ...prev,
      stories: prev.stories.filter(story => story.id !== storyId)
    }));
  };

  const getStoryTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <FileText className="w-4 h-4" />;
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'pregnancy':
        return '🤱';
      case 'birth':
        return '👶';
      case 'milestone':
        return '⭐';
      case 'achievement':
        return '🏆';
      default:
        return '📅';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora mesmo';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d atrás`;
    return formatDate(date);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
          {profile.coverImage && (
            <img
              src={profile.coverImage}
              alt="Capa do perfil"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/20"></div>
          <button
            onClick={handleEditProfile}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            aria-label="Editar perfil"
          >
            <Camera className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-16 mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
              {profile.name.charAt(0)}
            </div>
            <button
              onClick={handleEditProfile}
              className="absolute bottom-2 right-2 p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
              aria-label="Alterar foto do perfil"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {profile.name}
                </h1>
                {profile.verified && (
                  <Shield className="w-6 h-6 text-blue-500" aria-label="Verificado" />
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {profile.username}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {profile.bio}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Membro desde {formatDate(profile.joinDate)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Configurações"
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {profile.stats.posts}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Histórias
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {profile.stats.followers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Seguidores
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {profile.stats.following}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Seguindo
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {profile.stats.likes.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Curtidas
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {profile.stats.comments}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Comentários
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold text-gray-800 dark:text-white">
                  Nível {profile.level}
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {profile.xp}/{profile.nextLevelXp} XP
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
          {[
            { id: 'stories', label: 'Minhas Histórias', icon: FileText },
            { id: 'milestones', label: 'Marcos', icon: Calendar },
            { id: 'badges', label: 'Conquistas', icon: Award },
            { id: 'stats', label: 'Estatísticas', icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                aria-label={`Ver ${tab.label}`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Based on Active Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'stories' && (
          <motion.div
            key="stories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Create New Story Button */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <button className="w-full flex items-center justify-center gap-3 py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-pink-500 dark:hover:border-pink-400 transition-colors group">
                <Plus className="w-6 h-6 text-gray-400 group-hover:text-pink-500" />
                <span className="text-gray-600 dark:text-gray-400 group-hover:text-pink-500 font-medium">
                  Criar Nova História
                </span>
              </button>
            </div>

            {/* Stories List */}
            {profile.stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-100 dark:bg-pink-900/20 rounded-lg">
                      {getStoryTypeIcon(story.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        {story.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>{formatRelativeTime(story.createdAt)}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          {story.isPublic ? (
                            <Globe className="w-4 h-4" />
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                          <span>{story.isPublic ? 'Público' : 'Privado'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePrivacy(story.id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                      aria-label={story.isPublic ? 'Tornar privado' : 'Tornar público'}
                    >
                      {story.isPublic ? (
                        <Eye className="w-4 h-4 text-gray-400" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setEditingStory(story.id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                      aria-label="Editar história"
                    >
                      <Edit3 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteStory(story.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors"
                      aria-label="Excluir história"
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {story.content}
                </p>

                {story.media && (
                  <div className="mb-4">
                    <img
                      src={story.media}
                      alt={story.title}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {story.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {story.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {story.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {story.views}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'milestones' && (
          <motion.div
            key="milestones"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {profile.milestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{getMilestoneIcon(milestone.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        {milestone.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(milestone.date)}
                        </span>
                        <div className="flex items-center gap-1">
                          {milestone.isPublic ? (
                            <Globe className="w-4 h-4 text-green-500" />
                          ) : (
                            <Lock className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {milestone.description}
                    </p>
                    {milestone.image && (
                      <img
                        src={milestone.image}
                        alt={milestone.title}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'badges' && (
          <motion.div
            key="badges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {profile.badges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${badge.color} flex items-center justify-center text-3xl`}>
                  {badge.icon}
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                  {badge.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {badge.description}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Conquistado em {formatDate(badge.earnedAt)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                  Atividade Mensal
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Histórias criadas</span>
                    <span className="font-semibold text-gray-800 dark:text-white">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Comentários feitos</span>
                    <span className="font-semibold text-gray-800 dark:text-white">45</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Curtidas recebidas</span>
                    <span className="font-semibold text-gray-800 dark:text-white">234</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                  Crescimento
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Novos seguidores</span>
                    <span className="font-semibold text-green-600">+23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Engajamento</span>
                    <span className="font-semibold text-blue-600">+15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">XP ganho</span>
                    <span className="font-semibold text-purple-600">+450</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
