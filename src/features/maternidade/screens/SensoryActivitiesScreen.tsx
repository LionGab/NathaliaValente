import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Baby,
  Clock,
  Star,
  Heart,
  Palette,
  Hand,
  Eye,
  Volume2,
  ChevronRight,
  Check,
} from 'lucide-react';

interface SensoryActivity {
  id: string;
  title: string;
  description: string;
  ageRange: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sensoryType: 'visual' | 'auditory' | 'tactile' | 'multi';
  materials: string[];
  steps: string[];
  benefits: string[];
  tips: string[];
  safetyNotes: string[];
}

export const SensoryActivitiesScreen: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);

  const activities: SensoryActivity[] = [
    {
      id: '1',
      title: 'Caixa de Texturas',
      description: 'Exploração tátil com diferentes materiais',
      ageRange: '6-12 meses',
      duration: '15-20 min',
      difficulty: 'easy',
      sensoryType: 'tactile',
      materials: [
        'Caixa de papelão',
        'Tecidos variados (seda, veludo, algodão)',
        'Papel alumínio',
        'Esponja macia',
        'Plástico bolha',
      ],
      steps: [
        'Cole os materiais dentro da caixa',
        'Sente com o bebê em frente à caixa',
        'Guie a mãozinha dele para tocar cada textura',
        'Descreva as sensações: "Isso é macio", "Isso é áspero"',
        'Deixe-o explorar livremente por alguns minutos',
      ],
      benefits: [
        'Desenvolve sensibilidade tátil',
        'Estimula a curiosidade',
        'Amplia vocabulário sensorial',
      ],
      tips: ['Use texturas bem diferentes', 'Supervisione sempre', 'Repita em dias diferentes'],
      safetyNotes: [
        'Evite materiais muito pequenos',
        'Não deixe sozinho',
        'Use materiais atóxicos',
      ],
    },
    {
      id: '2',
      title: 'Garrafas Sensoriais',
      description: 'Estimulação visual com objetos em movimento',
      ageRange: '3-12 meses',
      duration: '10-15 min',
      difficulty: 'easy',
      sensoryType: 'visual',
      materials: [
        'Garrafas plásticas transparentes',
        'Água',
        'Corante alimentício',
        'Glitter',
        'Miçangas coloridas',
        'Óleo de bebê',
        'Cola quente',
      ],
      steps: [
        'Encha a garrafa com água até 3/4',
        'Adicione corante e glitter',
        'Para efeito calmo, adicione óleo de bebê',
        'Feche bem com cola quente',
        'Agite e mostre ao bebê',
        'Deixe-o explorar rolando e observando',
      ],
      benefits: ['Estimula rastreamento visual', 'Acalma e entretém', 'Desenvolve concentração'],
      tips: ['Varie as cores', 'Crie diferentes densidades', 'Use garrafas de tamanhos variados'],
      safetyNotes: [
        'Cole muito bem a tampa',
        'Verifique integridade antes de cada uso',
        'Descarte se danificada',
      ],
    },
    {
      id: '3',
      title: 'Música com Instrumentos Caseiros',
      description: 'Exploração sonora com objetos do dia a dia',
      ageRange: '6-12 meses',
      duration: '10-15 min',
      difficulty: 'easy',
      sensoryType: 'auditory',
      materials: [
        'Potes de plástico',
        'Colheres de pau',
        'Arroz em garrafa fechada',
        'Tampas de panela',
        'Caixinhas com feijão',
      ],
      steps: [
        'Sente-se no chão com o bebê',
        'Apresente cada "instrumento"',
        'Mostre como fazer sons diferentes',
        'Deixe-o experimentar',
        'Crie ritmos simples para ele imitar',
        'Cante enquanto ele toca',
      ],
      benefits: [
        'Desenvolve consciência auditiva',
        'Estimula coordenação',
        'Introduz conceitos musicais',
      ],
      tips: ['Varie o volume', 'Pause para ele processar', 'Sorria e celebre suas tentativas'],
      safetyNotes: ['Objetos devem ser grandes', 'Nada muito barulhento', 'Supervisione sempre'],
    },
    {
      id: '4',
      title: 'Pintura com Pudim',
      description: 'Arte sensorial comestível e segura',
      ageRange: '8-12 meses',
      duration: '15-20 min',
      difficulty: 'medium',
      sensoryType: 'multi',
      materials: [
        'Pudim instantâneo (sem açúcar)',
        'Corante alimentício',
        'Papel grande',
        'Babador',
        'Toalha no chão',
      ],
      steps: [
        'Prepare pudim mais líquido que o normal',
        'Divida em potes e colore cada um',
        'Coloque papel no chão sobre toalha',
        'Deixe o bebê explorar com as mãos',
        'Não se preocupe com resultado',
        'Foque na experiência',
      ],
      benefits: ['Exploração tátil segura', 'Liberdade criativa', 'Experiência multissensorial'],
      tips: ['Use roupas velhas', 'Tenha toalhas úmidas prontas', 'Tire fotos!'],
      safetyNotes: ['Ingredientes comestíveis', 'Supervisione sempre', 'Cuidado com alergias'],
    },
    {
      id: '5',
      title: 'Cesta de Descobertas',
      description: 'Exploração de objetos naturais e seguros',
      ageRange: '6-12 meses',
      duration: '15-20 min',
      difficulty: 'easy',
      sensoryType: 'multi',
      materials: [
        'Cesta baixa',
        'Objetos naturais (pinhas, pedras lisas)',
        'Colheres de madeira',
        'Escovas macias',
        'Tecidos',
        'Bolas de diferentes tamanhos',
      ],
      steps: [
        'Organize objetos na cesta',
        'Sente o bebê em frente',
        'Deixe-o pegar e explorar',
        'Nomeie cada objeto',
        'Descreva texturas e sons',
        'Troque objetos periodicamente',
      ],
      benefits: [
        'Estimula múltiplos sentidos',
        'Desenvolve coordenação motora',
        'Amplia consciência do mundo',
      ],
      tips: [
        'Rotate os objetos semanalmente',
        'Escolha itens contrastantes',
        'Observe suas preferências',
      ],
      safetyNotes: ['Objetos maiores que 4cm', 'Nada pontiagudo', 'Supervisão constante'],
    },
  ];

  const getSensoryIcon = (type: SensoryActivity['sensoryType']) => {
    switch (type) {
      case 'visual':
        return Eye;
      case 'auditory':
        return Volume2;
      case 'tactile':
        return Hand;
      case 'multi':
        return Palette;
    }
  };

  const getSensoryLabel = (type: SensoryActivity['sensoryType']) => {
    switch (type) {
      case 'visual':
        return 'Visual';
      case 'auditory':
        return 'Auditivo';
      case 'tactile':
        return 'Tátil';
      case 'multi':
        return 'Múltiplos Sentidos';
    }
  };

  const getDifficultyColor = (difficulty: SensoryActivity['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
    }
  };

  const getDifficultyLabel = (difficulty: SensoryActivity['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Médio';
      case 'hard':
        return 'Difícil';
    }
  };

  const toggleCompleted = (activityId: string) => {
    setCompletedActivities((prev) =>
      prev.includes(activityId) ? prev.filter((id) => id !== activityId) : [...prev, activityId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-3xl shadow-lg p-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Baby className="w-6 h-6 text-white" />
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Brincadeiras Sensoriais
                </h1>
              </div>
              <p className="text-blue-100 text-sm">Para bebês de até 1 ano</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-white" fill="white" />
                <span className="text-white text-xs">Atividades</span>
              </div>
              <p className="text-white text-2xl font-bold">{activities.length}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Check className="w-4 h-4 text-white" />
                <span className="text-white text-xs">Concluídas</span>
              </div>
              <p className="text-white text-2xl font-bold">{completedActivities.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Activities List */}
      <div className="px-6 space-y-4">
        {activities.map((activity, index) => {
          const SensoryIcon = getSensoryIcon(activity.sensoryType);
          const isExpanded = selectedActivity === activity.id;
          const isCompleted = completedActivities.includes(activity.id);

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`bg-white rounded-2xl shadow-md overflow-hidden ${isCompleted ? 'border-2 border-green-300' : ''}`}
            >
              {/* Card Header */}
              <button
                onClick={() => setSelectedActivity(isExpanded ? null : activity.id)}
                className="w-full p-4 flex items-start gap-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <SensoryIcon className="w-8 h-8 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-gray-800 text-lg">{activity.title}</h3>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 text-blue-600 font-medium">
                      <Clock className="w-3 h-3" />
                      {activity.duration}
                    </span>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                      {activity.ageRange}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full ${getDifficultyColor(activity.difficulty)}`}
                    >
                      {getDifficultyLabel(activity.difficulty)}
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
                  {/* Sensory Type */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg">
                    <SensoryIcon className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">
                      {getSensoryLabel(activity.sensoryType)}
                    </span>
                  </div>

                  {/* Materials */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-purple-500" />
                      Materiais Necessários
                    </h4>
                    <ul className="space-y-1">
                      {activity.materials.map((material, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-gray-700">
                          <span className="text-purple-500">•</span>
                          <span>{material}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Steps */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Check className="w-4 h-4 text-purple-500" />
                      Passo a Passo
                    </h4>
                    <ol className="space-y-2">
                      {activity.steps.map((step, idx) => (
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
                      <Star className="w-4 h-4 text-purple-500" />
                      Benefícios
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activity.benefits.map((benefit, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                        >
                          ✓ {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">💡 Dicas</h4>
                    <ul className="space-y-1">
                      {activity.tips.map((tip, idx) => (
                        <li key={idx} className="text-sm text-gray-600">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Safety Notes */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h4 className="font-semibold text-red-800 mb-2 text-sm">⚠️ Segurança</h4>
                    <ul className="space-y-1">
                      {activity.safetyNotes.map((note, idx) => (
                        <li key={idx} className="text-xs text-red-700">
                          • {note}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => toggleCompleted(activity.id)}
                    className={`w-full py-3 rounded-xl font-medium transition-all ${
                      isCompleted
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
                    }`}
                  >
                    {isCompleted ? 'Concluída ✓' : 'Marcar como Concluída'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
