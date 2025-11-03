import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Lock,
  Play,
  BookOpen,
  Camera,
  Star,
  Clock,
  Calendar as CalendarIcon,
  Sparkles,
} from 'lucide-react';

interface ExclusiveContent {
  id: string;
  type: 'video' | 'article' | 'photo' | 'tip';
  title: string;
  description: string;
  thumbnail: string;
  duration?: string;
  date: string;
  isPremium: boolean;
  tags: string[];
}

interface ExclusiveNathScreenProps {
  isPremiumUser?: boolean;
}

export const ExclusiveNathScreen: React.FC<ExclusiveNathScreenProps> = ({
  isPremiumUser = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tudo', icon: Star },
    { id: 'daily', label: 'Diário', icon: CalendarIcon },
    { id: 'tips', label: 'Dicas', icon: Sparkles },
    { id: 'videos', label: 'Vídeos', icon: Play },
    { id: 'articles', label: 'Artigos', icon: BookOpen },
  ];

  const exclusiveContents: ExclusiveContent[] = [
    {
      id: '1',
      type: 'video',
      title: 'Minha Rotina Matinal com o Bebê',
      description: 'Como organizo minha manhã para ter tempo de qualidade com meu filho',
      thumbnail: '🌅',
      duration: '8 min',
      date: 'Hoje',
      isPremium: false,
      tags: ['rotina', 'maternidade', 'dicas'],
    },
    {
      id: '2',
      type: 'tip',
      title: '5 Maneiras de Lidar com a Privação de Sono',
      description: 'Dicas práticas que me ajudaram nos primeiros meses',
      thumbnail: '💤',
      date: 'Ontem',
      isPremium: false,
      tags: ['sono', 'autocuidado'],
    },
    {
      id: '3',
      type: 'article',
      title: 'Voltando à Forma Após a Gestação',
      description: 'Minha jornada de recuperação pós-parto com exercícios seguros',
      thumbnail: '💪',
      date: '2 dias atrás',
      isPremium: true,
      tags: ['fitness', 'pós-parto'],
    },
    {
      id: '4',
      type: 'photo',
      title: 'Momentos Especiais da Semana',
      description: 'Galeria exclusiva de fotos dos nossos dias',
      thumbnail: '📸',
      date: '3 dias atrás',
      isPremium: true,
      tags: ['fotos', 'família'],
    },
    {
      id: '5',
      type: 'video',
      title: 'Preparando Papinha Caseira',
      description: 'Receita nutritiva e fácil que meu bebê adora',
      thumbnail: '🥕',
      duration: '12 min',
      date: '4 dias atrás',
      isPremium: false,
      tags: ['alimentação', 'receitas'],
    },
    {
      id: '6',
      type: 'tip',
      title: 'Como Equilibrar Trabalho e Maternidade',
      description: 'Estratégias que funcionam para mim no dia a dia',
      thumbnail: '⚖️',
      date: '5 dias atrás',
      isPremium: true,
      tags: ['trabalho', 'organização'],
    },
  ];

  const filteredContents =
    selectedCategory === 'all'
      ? exclusiveContents
      : exclusiveContents.filter((content) => {
          if (selectedCategory === 'videos') return content.type === 'video';
          if (selectedCategory === 'articles') return content.type === 'article';
          if (selectedCategory === 'tips') return content.type === 'tip';
          if (selectedCategory === 'daily')
            return content.date === 'Hoje' || content.date === 'Ontem';
          return true;
        });

  const getTypeIcon = (type: ExclusiveContent['type']) => {
    switch (type) {
      case 'video':
        return Play;
      case 'article':
        return BookOpen;
      case 'photo':
        return Camera;
      case 'tip':
        return Sparkles;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-b-3xl shadow-lg p-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-6 h-6 text-white" fill="white" />
                <h1 className="text-2xl md:text-3xl font-bold text-white">Exclusivo Nath</h1>
              </div>
              <p className="text-pink-100 text-sm">
                Conteúdos exclusivos do dia a dia da Nathalia Valente
              </p>
            </div>
            {!isPremiumUser && (
              <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold hover:bg-white/30 transition-all flex items-center gap-2">
                <Star className="w-4 h-4" fill="white" />
                Premium
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-white text-purple-600 shadow-md'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Content Grid */}
      <div className="px-6 space-y-4">
        {filteredContents.map((content, index) => {
          const TypeIcon = getTypeIcon(content.type);
          const isLocked = content.isPremium && !isPremiumUser;

          return (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`bg-white rounded-2xl shadow-md overflow-hidden ${
                isLocked ? 'opacity-75' : ''
              }`}
            >
              <div className="flex gap-4 p-4">
                {/* Thumbnail */}
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center text-3xl">
                    {content.thumbnail}
                  </div>
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {content.type === 'video' && !isLocked && (
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {content.duration}
                    </div>
                  )}
                </div>

                {/* Content Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800 line-clamp-2">{content.title}</h3>
                    <TypeIcon className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{content.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      {content.date}
                    </span>
                    {content.isPremium && (
                      <span className="flex items-center gap-1 text-purple-600">
                        <Star className="w-3 h-3" fill="currentColor" />
                        Premium
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="px-4 pb-4">
                <div className="flex flex-wrap gap-2">
                  {content.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              {!isLocked && (
                <div className="px-4 pb-4">
                  <button className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                    {content.type === 'video' ? 'Assistir Agora' : 'Ver Conteúdo'}
                  </button>
                </div>
              )}

              {/* Premium Upsell */}
              {isLocked && (
                <div className="px-4 pb-4">
                  <button className="w-full py-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-xl font-medium hover:from-purple-200 hover:to-pink-200 transition-all flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    Desbloquear com Premium
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Premium Banner */}
      {!isPremiumUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-6 mt-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-6 h-6" fill="white" />
              <h3 className="text-xl font-bold">Seja Premium</h3>
            </div>
            <p className="text-white/90 text-sm mb-4">
              Acesse todo o conteúdo exclusivo da Nathalia sem limites
            </p>
            <ul className="space-y-2 mb-4 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                Vídeos completos e tutoriais
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                Artigos detalhados sobre maternidade
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                Galeria de fotos exclusivas
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                Conteúdo novo toda semana
              </li>
            </ul>
            <button className="w-full py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all">
              Assinar Agora
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
