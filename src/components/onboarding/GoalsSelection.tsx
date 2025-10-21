import { useState } from 'react';
import { Check } from 'lucide-react';
import { ProgressIndicator } from './ProgressIndicator';

interface GoalsSelectionProps {
  onNext: (goals: string[]) => void;
  onBack: () => void;
}

const ONBOARDING_GOALS = [
  {
    id: 'connect',
    emoji: '👥',
    title: 'Conectar com outras mães',
    description: 'Fazer parte de uma comunidade acolhedora',
  },
  {
    id: 'faith',
    emoji: '🙏',
    title: 'Fortalecer minha fé',
    description: 'Crescer espiritualmente no dia a dia',
  },
  {
    id: 'journal',
    emoji: '📖',
    title: 'Registrar meus momentos',
    description: 'Guardar memórias e reflexões',
  },
  {
    id: 'habits',
    emoji: '✨',
    title: 'Criar hábitos saudáveis',
    description: 'Cuidar de mim também',
  },
  {
    id: 'support',
    emoji: '💭',
    title: 'Desabafar em espaço seguro',
    description: 'Compartilhar sem julgamentos',
  },
  {
    id: 'inspiration',
    emoji: '💫',
    title: 'Receber inspiração diária',
    description: 'Mensagens de fé e encorajamento',
  },
];

export const GoalsSelection = ({ onNext, onBack }: GoalsSelectionProps) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) => {
      if (prev.includes(goalId)) {
        return prev.filter((id) => id !== goalId);
      }
      // Limit to 3 selections
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, goalId];
    });
  };

  const handleNext = () => {
    if (selectedGoals.length > 0) {
      onNext(selectedGoals);
    }
  };

  const canProceed = selectedGoals.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-nath-lavender-50 via-white to-nath-cream-50 dark:from-claude-gray-950 dark:via-claude-gray-900 dark:to-claude-gray-950 p-6 flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="text-claude-gray-600 dark:text-claude-gray-400 hover:text-claude-gray-900 dark:hover:text-claude-gray-200 mb-4 transition-colors"
          >
            ← Voltar
          </button>

          <ProgressIndicator currentStep={1} totalSteps={3} />

          <h2 className="text-3xl font-bold text-claude-gray-900 dark:text-white mb-2">
            O que você busca aqui?
          </h2>
          <p className="text-claude-gray-600 dark:text-claude-gray-400">
            Selecione até 3 objetivos{' '}
            <span className="text-nath-pink-500 font-semibold">
              ({selectedGoals.length}/3)
            </span>
          </p>
        </div>

        <div className="space-y-3 mb-6 animate-slide-up">
          {ONBOARDING_GOALS.map((goal) => {
            const isSelected = selectedGoals.includes(goal.id);
            const isDisabled = !isSelected && selectedGoals.length >= 3;

            return (
              <button
                key={goal.id}
                onClick={() => !isDisabled && toggleGoal(goal.id)}
                disabled={isDisabled}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left relative ${
                  isSelected
                    ? 'border-nath-pink-400 bg-gradient-to-r from-nath-pink-50 to-nath-lavender-50 dark:from-nath-pink-900/20 dark:to-nath-lavender-900/20 shadow-claude scale-[1.02]'
                    : isDisabled
                    ? 'border-claude-gray-200 dark:border-claude-gray-800 bg-claude-gray-50 dark:bg-claude-gray-900 opacity-50 cursor-not-allowed'
                    : 'border-claude-gray-200 dark:border-claude-gray-700 bg-white dark:bg-claude-gray-800 hover:border-nath-pink-300 hover:shadow-claude-sm'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{goal.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-claude-gray-900 dark:text-white mb-1">
                      {goal.title}
                    </h3>
                    <p className="text-sm text-claude-gray-600 dark:text-claude-gray-400">
                      {goal.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-r from-nath-pink-400 to-nath-lavender-500 rounded-full flex items-center justify-center shadow-claude animate-scale-in">
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Helper Text */}
        {selectedGoals.length === 0 && (
          <p className="text-center text-sm text-claude-gray-500 dark:text-claude-gray-400 mb-6 animate-pulse">
            Escolha pelo menos 1 objetivo para continuar
          </p>
        )}

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`w-full py-4 px-6 rounded-2xl font-semibold text-base transition-all duration-300 ${
            canProceed
              ? 'bg-gradient-to-r from-nath-pink-400 to-nath-lavender-500 hover:from-nath-pink-500 hover:to-nath-lavender-600 text-white shadow-claude-md hover:shadow-claude-lg transform hover:scale-[1.02]'
              : 'bg-claude-gray-200 dark:bg-claude-gray-800 text-claude-gray-400 dark:text-claude-gray-600 cursor-not-allowed'
          }`}
        >
          Continuar →
        </button>
      </div>
    </div>
  );
};
