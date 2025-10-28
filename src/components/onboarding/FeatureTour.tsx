import { MessageCircle, BookHeart, Users, Sparkles, Heart } from 'lucide-react';
import { ProgressIndicator } from './ProgressIndicator';

interface FeatureTourProps {
  selectedGoals: string[];
  onComplete: () => void;
  onBack: () => void;
}

const FEATURES = [
  {
    id: 'feed',
    icon: Users,
    color: 'from-nath-pink-400 to-nath-pink-500',
    title: 'Feed da Comunidade',
    description: 'Compartilhe momentos, looks, desabafos e dicas com outras mães',
    relatedGoals: ['connect', 'support'],
  },
  {
    id: 'chat',
    icon: MessageCircle,
    color: 'from-nath-lavender-400 to-nath-lavender-500',
    title: 'Robô Nath',
    description: 'Sua amiga virtual sempre pronta para te ouvir e encorajar',
    relatedGoals: ['support', 'inspiration'],
  },
  {
    id: 'daily',
    icon: BookHeart,
    color: 'from-nath-peach-400 to-nath-peach-500',
    title: 'Versículo do Dia',
    description: 'Inspire-se diariamente com mensagens de fé e esperança',
    relatedGoals: ['faith', 'inspiration'],
  },
  {
    id: 'profile',
    icon: Heart,
    color: 'from-nath-pink-500 to-nath-lavender-500',
    title: 'Seus Tesouros',
    description: 'Guarde posts, citações e versículos que tocaram seu coração',
    relatedGoals: ['journal', 'inspiration'],
  },
];

export const FeatureTour = ({ selectedGoals, onComplete, onBack }: FeatureTourProps) => {
  // Show features relevant to selected goals first
  const sortedFeatures = [...FEATURES].sort((a, b) => {
    const aRelevant = a.relatedGoals.some((goal) => selectedGoals.includes(goal));
    const bRelevant = b.relatedGoals.some((goal) => selectedGoals.includes(goal));
    if (aRelevant && !bRelevant) return -1;
    if (!aRelevant && bRelevant) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-nath-cream-50 via-nath-pink-50 to-nath-lavender-50 dark:from-claude-gray-950 dark:via-claude-gray-900 dark:to-claude-gray-950 p-6 flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="text-claude-gray-600 dark:text-claude-gray-400 hover:text-claude-gray-900 dark:hover:text-claude-gray-200 mb-4 transition-colors"
          >
            ← Voltar
          </button>

          <ProgressIndicator currentStep={2} totalSteps={3} />

          <h2 className="text-3xl font-bold text-claude-gray-900 dark:text-white mb-2">
            Explore o NathClub ✨
          </h2>
          <p className="text-claude-gray-600 dark:text-claude-gray-400">
            Recursos escolhidos especialmente para você
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8 animate-slide-up">
          {sortedFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const isRelevant = feature.relatedGoals.some((goal) => selectedGoals.includes(goal));

            return (
              <div
                key={feature.id}
                className={`p-5 rounded-2xl transition-all duration-300 ${
                  isRelevant
                    ? 'bg-white dark:bg-claude-gray-800 shadow-claude-md border-2 border-nath-pink-200 dark:border-nath-pink-800'
                    : 'bg-white/60 dark:bg-claude-gray-800/60 shadow-claude-sm'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} shadow-claude flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-claude-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      {isRelevant && (
                        <span className="flex-shrink-0 text-xs px-2 py-0.5 bg-nath-pink-100 dark:bg-nath-pink-900/30 text-nath-pink-700 dark:text-nath-pink-400 rounded-full font-medium">
                          Para você
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-claude-gray-600 dark:text-claude-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Encouragement Message */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-nath-pink-50 to-nath-lavender-50 dark:from-nath-pink-900/20 dark:to-nath-lavender-900/20 border border-nath-pink-200 dark:border-nath-pink-800 mb-6">
          <p className="text-sm text-center text-claude-gray-700 dark:text-claude-gray-300">
            <span className="font-semibold text-nath-pink-600 dark:text-nath-pink-400">
              "Você foi escolhida para isso!"
            </span>
            <br />
            <span className="text-xs text-claude-gray-600 dark:text-claude-gray-400">
              - Nathália Valente
            </span>
          </p>
        </div>

        {/* Complete Button */}
        <button
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-nath-pink-400 via-nath-lavender-400 to-nath-pink-500 hover:from-nath-pink-500 hover:via-nath-lavender-500 hover:to-nath-pink-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-claude-lg hover:shadow-claude-md transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Explorar agora
          <Sparkles className="w-5 h-5" />
        </button>

        {/* Fun Fact */}
        <p className="text-center text-xs text-claude-gray-500 dark:text-claude-gray-500 mt-4">
          Você pode acessar todos os recursos na barra de navegação inferior 💜
        </p>
      </div>
    </div>
  );
};
