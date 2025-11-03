/**
 * Exclusivo Nath Screen
 * Content shared by Nathalia Valente
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Image, FileText, Sparkles, Heart, MessageCircle, Play, Clock } from 'lucide-react';
import type { NathContent } from '../types';

const SAMPLE_CONTENT: NathContent[] = [
  {
    id: '1',
    type: 'video',
    title: 'Dicas para amamentação tranquila',
    description: 'Aprenda técnicas que me ajudaram muito nos primeiros meses',
    duration: 8,
    thumbnail: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400',
    createdAt: new Date('2024-11-01'),
    isForPregnant: false,
  },
  {
    id: '2',
    type: 'story',
    title: 'Minha rotina matinal com o bebê',
    description: 'Como organizo o dia para ter tempo para mim também',
    thumbnail: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400',
    createdAt: new Date('2024-11-02'),
    isForPregnant: false,
  },
  {
    id: '3',
    type: 'post',
    title: 'Preparando-se para a maternidade',
    description: 'O que eu gostaria de ter sabido antes do nascimento',
    thumbnail: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400',
    createdAt: new Date('2024-11-01'),
    isForPregnant: true,
  },
  {
    id: '4',
    type: 'insight',
    title: 'Lidando com a culpa materna',
    description: 'Reflexões sobre ser uma mãe imperfeita e feliz',
    createdAt: new Date('2024-10-30'),
    isForPregnant: false,
  },
  {
    id: '5',
    type: 'video',
    title: 'Exercícios pós-parto seguros',
    description: 'Voltando à forma com cuidado e amor próprio',
    duration: 15,
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    createdAt: new Date('2024-10-28'),
    isForPregnant: false,
  },
];

export function ExclusivoNath() {
  const [filter, setFilter] = useState<'all' | 'pregnant'>('all');
  const [showFeedback, setShowFeedback] = useState(false);

  const filteredContent =
    filter === 'pregnant' ? SAMPLE_CONTENT.filter((c) => c.isForPregnant) : SAMPLE_CONTENT;

  const getContentIcon = (type: NathContent['type']) => {
    switch (type) {
      case 'video':
        return Video;
      case 'story':
        return Image;
      case 'post':
        return FileText;
      case 'insight':
        return Sparkles;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-b-3xl shadow-lg p-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Exclusivo Nath</h1>
              <p className="text-sm text-white/80">Conteúdos especiais para você</p>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-white text-primary-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('pregnant')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === 'pregnant'
                  ? 'bg-white text-primary-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Para gestantes
            </button>
          </div>
        </motion.div>
      </div>

      {/* Content grid */}
      <div className="p-6 space-y-4">
        {filteredContent.map((content, idx) => {
          const Icon = getContentIcon(content.type);

          return (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden"
            >
              {/* Thumbnail */}
              {content.thumbnail && (
                <div className="relative h-48 bg-neutral-200">
                  <img
                    src={content.thumbnail}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                  {content.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-primary-600 ml-1" />
                      </div>
                    </div>
                  )}
                  {content.duration && (
                    <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {content.duration} min
                    </div>
                  )}
                </div>
              )}

              {/* Content info */}
              <div className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-800 mb-1">{content.title}</h3>
                    <p className="text-sm text-neutral-600">{content.description}</p>
                  </div>
                </div>

                {/* Meta info */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                  <span className="text-xs text-neutral-500">
                    {content.createdAt.toLocaleDateString('pt-BR')}
                  </span>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-neutral-500 hover:text-primary-600 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">42</span>
                    </button>
                    <button className="flex items-center gap-1 text-neutral-500 hover:text-primary-600 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">12</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Feedback button */}
      <div className="fixed bottom-24 right-6">
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.5 }}
          onClick={() => setShowFeedback(true)}
          className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Feedback modal */}
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-end justify-center p-4 z-50"
          onClick={() => setShowFeedback(false)}
        >
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="bg-white rounded-t-3xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-neutral-800 mb-4">Deixe seu relato</h3>
            <textarea
              placeholder="Compartilhe sua experiência ou sugestão..."
              className="w-full h-32 px-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-primary-400 focus:outline-none resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowFeedback(false)}
                className="flex-1 py-3 rounded-2xl border-2 border-neutral-200 text-neutral-700 font-semibold hover:bg-neutral-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Handle feedback submission
                  setShowFeedback(false);
                }}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold hover:shadow-lg transition-shadow"
              >
                Enviar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
