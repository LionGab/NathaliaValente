import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  Heart, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  MapPin,
  User
} from 'lucide-react';

interface CommunityHighlight {
  id: string;
  type: 'event' | 'testimonial' | 'achievement' | 'tip';
  title: string;
  description: string;
  author?: string;
  date?: string;
  location?: string;
  image?: string;
  likes?: number;
  category?: string;
}

const mockHighlights: CommunityHighlight[] = [
  {
    id: '1',
    type: 'event',
    title: 'Encontro Virtual: Amamentação',
    description: 'Live com especialista em amamentação - 15/02 às 19h',
    date: '15/02/2024',
    location: 'Online',
    category: 'Amamentação',
    likes: 45
  },
  {
    id: '2',
    type: 'testimonial',
    title: 'Depoimento Inspirador',
    description: '"A comunidade me ajudou a superar a ansiedade na gravidez"',
    author: 'Maria Silva',
    category: 'Depoimento',
    likes: 32
  },
  {
    id: '3',
    type: 'tip',
    title: 'Dica da Semana',
    description: 'Exercícios de respiração para aliviar dores nas costas',
    category: 'Bem-estar',
    likes: 28
  },
  {
    id: '4',
    type: 'achievement',
    title: 'Conquista Coletiva',
    description: '1000+ mães conectadas esta semana!',
    category: 'Comunidade',
    likes: 156
  }
];

export const DynamicHeroBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockHighlights.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % mockHighlights.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + mockHighlights.length) % mockHighlights.length);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="w-5 h-5" />;
      case 'testimonial':
        return <Heart className="w-5 h-5" />;
      case 'tip':
        return <Star className="w-5 h-5" />;
      case 'achievement':
        return <Users className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  const getColorScheme = (type: string) => {
    switch (type) {
      case 'event':
        return 'from-blue-500 to-indigo-600';
      case 'testimonial':
        return 'from-pink-500 to-rose-600';
      case 'tip':
        return 'from-green-500 to-emerald-600';
      case 'achievement':
        return 'from-purple-500 to-violet-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const currentHighlight = mockHighlights[currentIndex];

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
      {/* Background with gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getColorScheme(currentHighlight.type)} opacity-90`} />
      
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-between p-6 sm:p-8">
        {/* Main Content */}
        <div className="flex-1 text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Category Badge */}
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  {getIcon(currentHighlight.type)}
                </div>
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  {currentHighlight.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
                {currentHighlight.title}
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg opacity-90 leading-relaxed max-w-2xl">
                {currentHighlight.description}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {currentHighlight.author && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{currentHighlight.author}</span>
                  </div>
                )}
                {currentHighlight.date && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{currentHighlight.date}</span>
                  </div>
                )}
                {currentHighlight.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{currentHighlight.location}</span>
                  </div>
                )}
                {currentHighlight.likes && (
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span>{currentHighlight.likes} curtidas</span>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="flex flex-col gap-2">
          <button
            onClick={prevSlide}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all duration-200 touch-target"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          
          <button
            onClick={nextSlide}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all duration-200 touch-target"
            aria-label="Próximo slide"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {mockHighlights.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Pause/Play Indicator */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all duration-200 touch-target"
        aria-label={isAutoPlaying ? 'Pausar slideshow' : 'Reproduzir slideshow'}
      >
        <div className={`w-3 h-3 ${isAutoPlaying ? 'bg-white' : 'bg-white/50'}`} />
      </button>
    </div>
  );
};
