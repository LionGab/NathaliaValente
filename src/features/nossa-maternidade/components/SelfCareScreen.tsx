/**
 * Self-Care Activities Screen
 * 10-minute self-care suggestions
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Star,
  Calendar,
  Play,
  Coffee,
  Book,
  Music,
  Flower2,
  Wind,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import type { SelfCareActivity } from '../types';

const ACTIVITIES: SelfCareActivity[] = [
  {
    id: '1',
    title: 'Respiração consciente',
    description: 'Pratique 5 minutos de respiração profunda para acalmar a mente',
    duration: 5,
    category: 'Relaxamento',
    icon: 'wind',
  },
  {
    id: '2',
    title: 'Pausa para café mindful',
    description: 'Tome seu café com atenção plena, saboreando cada gole',
    duration: 10,
    category: 'Momento para você',
    icon: 'coffee',
  },
  {
    id: '3',
    title: 'Alongamento matinal',
    description: 'Movimentos suaves para despertar o corpo com energia',
    duration: 10,
    category: 'Movimento',
    icon: 'sun',
  },
  {
    id: '4',
    title: 'Leitura inspiradora',
    description: 'Leia uma página de algo que te inspire ou relaxe',
    duration: 10,
    category: 'Momento para você',
    icon: 'book',
  },
  {
    id: '5',
    title: 'Música relaxante',
    description: 'Ouça uma música que te acalma e te faz feliz',
    duration: 5,
    category: 'Relaxamento',
    icon: 'music',
  },
  {
    id: '6',
    title: 'Gratidão diária',
    description: 'Anote 3 coisas pelas quais você é grata hoje',
    duration: 5,
    category: 'Mindfulness',
    icon: 'sparkles',
  },
  {
    id: '7',
    title: 'Cuidados com a pele',
    description: 'Uma rotina rápida de skincare para se sentir renovada',
    duration: 10,
    category: 'Beleza',
    icon: 'flower2',
  },
  {
    id: '8',
    title: 'Meditação guiada',
    description: 'Uma meditação curta para reconectar com você mesma',
    duration: 10,
    category: 'Mindfulness',
    icon: 'moon',
  },
  {
    id: '9',
    title: 'Caminhada rápida',
    description: 'Um passeio rápido ao ar livre para renovar as energias',
    duration: 10,
    category: 'Movimento',
    icon: 'sun',
  },
  {
    id: '10',
    title: 'Momento de carinho',
    description: 'Dedique tempo para abraçar e se conectar com seu bebê',
    duration: 10,
    category: 'Conexão',
    icon: 'heart',
  },
];

const ICON_MAP = {
  wind: Wind,
  coffee: Coffee,
  sun: Sun,
  book: Book,
  music: Music,
  sparkles: Sparkles,
  flower2: Flower2,
  moon: Moon,
  heart: Heart,
};

export function SelfCareScreen() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedActivity, setSelectedActivity] = useState<SelfCareActivity | null>(null);

  const toggleFavorite = (activityId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(activityId)) {
        newFavorites.delete(activityId);
      } else {
        newFavorites.add(activityId);
      }
      return newFavorites;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-b-3xl shadow-lg p-6 mb-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Autocuidado</h1>
              <p className="text-sm text-white/80">Pequenos momentos, grandes mudanças</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Activities grid */}
      <div className="px-6 space-y-4">
        {ACTIVITIES.map((activity, idx) => {
          const Icon = ICON_MAP[activity.icon as keyof typeof ICON_MAP] || Heart;
          const isFavorited = favorites.has(activity.id);

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-7 h-7 text-primary-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-800 mb-1">{activity.title}</h3>
                  <p className="text-sm text-neutral-600 mb-3">{activity.description}</p>

                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-xs text-neutral-500 mb-4">
                    <span className="flex items-center gap-1">⏱️ {activity.duration} min</span>
                    <span className="px-2 py-1 bg-primary-50 text-primary-600 rounded-lg">
                      {activity.category}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFavorite(activity.id)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        isFavorited
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                      <span className="hidden sm:inline">
                        {isFavorited ? 'Favoritado' : 'Favoritar'}
                      </span>
                    </button>

                    <button className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors">
                      <Calendar className="w-4 h-4" />
                      <span className="hidden sm:inline">Agendar</span>
                    </button>

                    <button
                      onClick={() => setSelectedActivity(activity)}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg transition-shadow ml-auto"
                    >
                      <Play className="w-4 h-4" />
                      Começar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Activity detail modal */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedActivity(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                {(() => {
                  const Icon = ICON_MAP[selectedActivity.icon as keyof typeof ICON_MAP] || Heart;
                  return <Icon className="w-10 h-10 text-primary-600" />;
                })()}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-neutral-800 text-center mb-2">
                {selectedActivity.title}
              </h2>

              {/* Duration */}
              <p className="text-center text-neutral-600 mb-6">
                ⏱️ {selectedActivity.duration} minutos
              </p>

              {/* Description */}
              <p className="text-neutral-700 mb-8 text-center">{selectedActivity.description}</p>

              {/* Action buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    // Start activity
                    setSelectedActivity(null);
                  }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold hover:shadow-lg transition-shadow"
                >
                  Começar agora
                </button>
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="w-full py-4 rounded-2xl border-2 border-neutral-200 text-neutral-700 font-semibold hover:bg-neutral-50 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Encouragement card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mx-6 mt-6 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl p-6"
      >
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-primary-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-neutral-800 mb-2">
            Lembre-se: cuidar de você é cuidar do seu bebê
          </p>
          <p className="text-xs text-neutral-700">
            Cada pequeno momento de autocuidado faz diferença na sua jornada maternal
          </p>
        </div>
      </motion.div>
    </div>
  );
}
