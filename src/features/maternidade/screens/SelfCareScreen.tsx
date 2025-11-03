import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Clock,
  Star,
  BookOpen,
  Music,
  Coffee,
  Sparkles,
  Wind,
  Sun,
  Droplet,
  Check,
  Calendar,
} from 'lucide-react';

interface SelfCareTip {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  icon: React.ComponentType<{ className?: string }>;
  category: 'physical' | 'mental' | 'emotional' | 'spiritual';
  steps: string[];
  benefits: string[];
  isFavorite: boolean;
}

export const SelfCareScreen: React.FC = () => {
  const [selectedTip, setSelectedTip] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const selfCareTips: SelfCareTip[] = [
    {
      id: '1',
      title: 'Respiração Consciente',
      description: 'Técnica simples de respiração para reduzir ansiedade',
      duration: 5,
      icon: Wind,
      category: 'mental',
      steps: [
        'Sente-se confortavelmente',
        'Inspire profundamente por 4 segundos',
        'Segure por 4 segundos',
        'Expire lentamente por 6 segundos',
        'Repita 5 vezes',
      ],
      benefits: ['Reduz ansiedade', 'Melhora foco', 'Acalma a mente'],
      isFavorite: false,
    },
    {
      id: '2',
      title: 'Alongamento Rápido',
      description: 'Exercícios suaves para relaxar o corpo',
      duration: 7,
      icon: Sun,
      category: 'physical',
      steps: [
        'Alongue os braços acima da cabeça',
        'Rotacione os ombros',
        'Incline o pescoço suavemente',
        'Alongue as pernas',
        'Respire profundamente durante cada movimento',
      ],
      benefits: ['Alivia tensão muscular', 'Aumenta energia', 'Melhora postura'],
      isFavorite: false,
    },
    {
      id: '3',
      title: 'Pausa para o Chá',
      description: 'Momento de pausa consciente com sua bebida favorita',
      duration: 10,
      icon: Coffee,
      category: 'emotional',
      steps: [
        'Prepare seu chá ou café favorito',
        'Sente-se em um local tranquilo',
        'Aprecie o aroma',
        'Beba lentamente, saboreando cada gole',
        'Foque apenas neste momento',
      ],
      benefits: ['Promove relaxamento', 'Momento de prazer', 'Reduz estresse'],
      isFavorite: false,
    },
    {
      id: '4',
      title: 'Escrita Terapêutica',
      description: 'Expresse seus sentimentos no papel',
      duration: 10,
      icon: BookOpen,
      category: 'emotional',
      steps: [
        'Pegue um caderno ou app de notas',
        'Escreva livremente por 10 minutos',
        'Não se preocupe com gramática',
        'Expresse o que está sentindo',
        'Releia se quiser ou simplesmente deixe ir',
      ],
      benefits: ['Processa emoções', 'Clareia pensamentos', 'Alivia carga emocional'],
      isFavorite: false,
    },
    {
      id: '5',
      title: 'Música Relaxante',
      description: 'Momento musical para acalmar a mente',
      duration: 8,
      icon: Music,
      category: 'mental',
      steps: [
        'Escolha uma música calma',
        'Use fones de ouvido se possível',
        'Feche os olhos',
        'Foque apenas na música',
        'Deixe-se levar pela melodia',
      ],
      benefits: ['Reduz ansiedade', 'Melhora humor', 'Promove relaxamento'],
      isFavorite: false,
    },
    {
      id: '6',
      title: 'Hidratação Consciente',
      description: 'Beba água com atenção plena',
      duration: 3,
      icon: Droplet,
      category: 'physical',
      steps: [
        'Prepare um copo de água',
        'Segure o copo com ambas as mãos',
        'Sinta a temperatura',
        'Beba lentamente',
        'Agradeça por cuidar do seu corpo',
      ],
      benefits: ['Melhora hidratação', 'Momento de pausa', 'Conexão com o corpo'],
      isFavorite: false,
    },
    {
      id: '7',
      title: 'Gratidão Diária',
      description: 'Liste três coisas pelas quais é grata',
      duration: 5,
      icon: Heart,
      category: 'emotional',
      steps: [
        'Pense em 3 coisas boas do seu dia',
        'Podem ser pequenas coisas',
        'Escreva ou apenas reflita',
        'Sinta a gratidão no coração',
        'Sorria para si mesma',
      ],
      benefits: ['Aumenta positividade', 'Melhora humor', 'Fortalece resiliência'],
      isFavorite: false,
    },
    {
      id: '8',
      title: 'Meditação Rápida',
      description: 'Minutos de silêncio e presença',
      duration: 5,
      icon: Sparkles,
      category: 'spiritual',
      steps: [
        'Sente-se confortavelmente',
        'Feche os olhos suavemente',
        'Observe sua respiração',
        'Quando a mente divagar, volte gentilmente',
        'Agradeça ao terminar',
      ],
      benefits: ['Clareia a mente', 'Reduz estresse', 'Aumenta paz interior'],
      isFavorite: false,
    },
    {
      id: '9',
      title: 'Cuidado com a Pele',
      description: 'Ritual rápido de skincare',
      duration: 10,
      icon: Sparkles,
      category: 'physical',
      steps: [
        'Lave o rosto com água morna',
        'Aplique seu hidratante favorito',
        'Massageie gentilmente',
        'Use protetor solar',
        'Aprecie seu reflexo',
      ],
      benefits: ['Melhora autoestima', 'Momento de autocuidado', 'Pele saudável'],
      isFavorite: false,
    },
    {
      id: '10',
      title: 'Olhar pela Janela',
      description: 'Conexão com o mundo externo',
      duration: 5,
      icon: Sun,
      category: 'mental',
      steps: [
        'Vá até uma janela',
        'Observe o céu, árvores, movimento',
        'Respire o ar (abra a janela se possível)',
        'Note os detalhes',
        'Sinta-se parte do mundo maior',
      ],
      benefits: ['Descansa a vista', 'Reduz clausura', 'Renova perspectiva'],
      isFavorite: false,
    },
  ];

  const toggleFavorite = (tipId: string) => {
    setFavorites((prev) =>
      prev.includes(tipId) ? prev.filter((id) => id !== tipId) : [...prev, tipId]
    );
  };

  const getCategoryColor = (category: SelfCareTip['category']) => {
    switch (category) {
      case 'physical':
        return 'from-green-400 to-emerald-500';
      case 'mental':
        return 'from-blue-400 to-indigo-500';
      case 'emotional':
        return 'from-pink-400 to-rose-500';
      case 'spiritual':
        return 'from-purple-400 to-violet-500';
    }
  };

  const getCategoryLabel = (category: SelfCareTip['category']) => {
    switch (category) {
      case 'physical':
        return 'Físico';
      case 'mental':
        return 'Mental';
      case 'emotional':
        return 'Emocional';
      case 'spiritual':
        return 'Espiritual';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-b-3xl shadow-lg p-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-6 h-6 text-white" fill="white" />
                <h1 className="text-2xl md:text-3xl font-bold text-white">Autocuidado</h1>
              </div>
              <p className="text-purple-100 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                10 sugestões em menos de 10 minutos
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-white" fill="white" />
                <span className="text-white text-xs">Favoritos</span>
              </div>
              <p className="text-white text-2xl font-bold">{favorites.length}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-white" />
                <span className="text-white text-xs">Esta semana</span>
              </div>
              <p className="text-white text-2xl font-bold">3</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tips Grid */}
      <div className="px-6 space-y-4">
        {selfCareTips.map((tip, index) => {
          const Icon = tip.icon;
          const isExpanded = selectedTip === tip.id;
          const isFav = favorites.includes(tip.id);

          return (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              {/* Card Header */}
              <button
                onClick={() => setSelectedTip(isExpanded ? null : tip.id)}
                className="w-full p-4 flex items-start gap-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getCategoryColor(tip.category)} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-gray-800 text-lg">{tip.title}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(tip.id);
                      }}
                      className="flex-shrink-0"
                    >
                      <Star
                        className={`w-5 h-5 ${isFav ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                      />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{tip.description}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-purple-600 font-medium">
                      <Clock className="w-3 h-3" />
                      {tip.duration} min
                    </span>
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full">
                      {getCategoryLabel(tip.category)}
                    </span>
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-100 p-4 space-y-4"
                >
                  {/* Steps */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Check className="w-4 h-4 text-purple-500" />
                      Passos
                    </h4>
                    <ol className="space-y-2">
                      {tip.steps.map((step, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-gray-700">
                          <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      Benefícios
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {tip.benefits.map((benefit, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                        >
                          ✓ {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                      Iniciar Agora
                    </button>
                    <button className="px-6 py-3 border-2 border-purple-300 text-purple-600 rounded-xl font-medium hover:bg-purple-50 transition-all">
                      Agendar
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
