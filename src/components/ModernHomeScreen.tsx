/**
 * Nossa Maternidade - Modern Home Screen
 * Tela inicial moderna com design hierárquico e responsivo
 */

import { useState, useEffect } from 'react';
import { 
  Heart, 
  Sparkles, 
  Users, 
  MessageCircle, 
  BookHeart, 
  Star,
  ArrowRight,
  Plus,
  Bell,
  Search,
  Menu,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Button } from './ui/Button';

interface ModernHomeScreenProps {
  onCreatePost: () => void;
  onSearch: () => void;
  onNotifications: () => void;
  onMenu: () => void;
}

export const ModernHomeScreen = ({ 
  onCreatePost, 
  onSearch, 
  onNotifications, 
  onMenu 
}: ModernHomeScreenProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const quickActions = [
    {
      icon: MessageCircle,
      title: 'Chat',
      subtitle: 'Converse com outras mães',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      onClick: () => console.log('Chat')
    },
    {
      icon: BookHeart,
      title: 'Devocional',
      subtitle: 'Versículo do dia',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      onClick: () => console.log('Devocional')
    },
    {
      icon: Users,
      title: 'Grupos',
      subtitle: 'Comunidades temáticas',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      onClick: () => console.log('Grupos')
    },
    {
      icon: Star,
      title: 'Favoritos',
      subtitle: 'Seus tesouros',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      onClick: () => console.log('Favoritos')
    }
  ];

  const recentPosts = [
    {
      id: 1,
      author: 'Maria Silva',
      avatar: '👩‍👧',
      content: 'Hoje foi um dia difícil, mas ver o sorriso da minha pequena me dá forças...',
      time: '2h',
      likes: 12,
      comments: 3,
      isLiked: false
    },
    {
      id: 2,
      author: 'Ana Costa',
      avatar: '👩‍👦',
      content: 'Dica de ouro: organização que realmente funciona para mães ocupadas!',
      time: '4h',
      likes: 28,
      comments: 7,
      isLiked: true
    },
    {
      id: 3,
      author: 'Carla Santos',
      avatar: '👩‍👧‍👦',
      content: 'Versículo que me fortaleceu hoje: "Tudo posso naquele que me fortalece"',
      time: '6h',
      likes: 15,
      comments: 4,
      isLiked: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center gap-3">
              <button
                onClick={onMenu}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Nossa Maternidade
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatTime(currentTime)} • {formatDate(currentTime)}
                </p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <button
                onClick={onSearch}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Search className="w-6 h-6" />
              </button>
              <button
                onClick={onNotifications}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors relative"
              >
                <Bell className="w-6 h-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  Bem-vinda de volta! 👋
                </h2>
                <p className="text-pink-100">
                  Como está se sentindo hoje?
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <div className="flex-1">
                <p className="text-sm font-medium">Versículo do dia</p>
                <p className="text-xs text-pink-100">"Tudo posso naquele que me fortalece"</p>
              </div>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Acesso rápido
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`${action.bgColor} p-4 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 group`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {action.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Posts recentes
            </h3>
            <button className="text-pink-600 dark:text-pink-400 text-sm font-medium flex items-center gap-1 hover:text-pink-700 dark:hover:text-pink-300 transition-colors">
              Ver todos
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20 dark:border-gray-700/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center text-xl">
                    {post.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {post.author}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {post.time}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4">
                      <button className={`flex items-center gap-1 text-sm transition-colors ${
                        post.isLiked 
                          ? 'text-pink-600 dark:text-pink-400' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400'
                      }`}>
                        <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={onCreatePost}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-40"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};
