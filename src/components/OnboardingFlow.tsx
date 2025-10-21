import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Target, Users, BookHeart, TrendingUp, Award, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface UserPreferences {
  goals: string[];
  interests: string[];
  phase: string;
}

const GOALS = [
  { id: 'mental-wellbeing', label: 'Bem-estar Mental', icon: <Heart className="w-5 h-5" /> },
  { id: 'physical-health', label: 'Saúde Física', icon: <TrendingUp className="w-5 h-5" /> },
  { id: 'personal-growth', label: 'Crescimento Pessoal', icon: <Target className="w-5 h-5" /> },
  { id: 'community', label: 'Conexão com Comunidade', icon: <Users className="w-5 h-5" /> },
  { id: 'spirituality', label: 'Espiritualidade e Fé', icon: <Sparkles className="w-5 h-5" /> },
];

const LIFE_PHASES = [
  { id: 'student', label: 'Estudante' },
  { id: 'professional', label: 'Profissional' },
  { id: 'mom', label: 'Mãe' },
  { id: 'entrepreneur', label: 'Empreendedora' },
  { id: 'other', label: 'Outro' },
];

const INTERESTS = [
  { id: 'habits', label: 'Hábitos Saudáveis', icon: <CheckCircle2 className="w-4 h-4" /> },
  { id: 'journaling', label: 'Journaling', icon: <BookHeart className="w-4 h-4" /> },
  { id: 'motivation', label: 'Motivação', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'self-care', label: 'Autocuidado', icon: <Heart className="w-4 h-4" /> },
  { id: 'achievement', label: 'Conquistas', icon: <Award className="w-4 h-4" /> },
];

export default function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const { user, profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({
    goals: [],
    interests: [],
    phase: '',
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 0,
      title: `Bem-vinda, ${profile?.full_name?.split(' ')[0] || 'amiga'}! 💛`,
      description: 'Vamos personalizar sua experiência no ClubNath em apenas 3 passos.',
      icon: <Heart className="w-12 h-12 text-orange-500" />,
    },
    {
      id: 1,
      title: 'Quais são seus principais objetivos?',
      description: 'Escolha até 3 áreas que você quer focar:',
      icon: <Target className="w-12 h-12 text-orange-500" />,
    },
    {
      id: 2,
      title: 'Em que fase da vida você está?',
      description: 'Isso nos ajuda a personalizar o conteúdo para você:',
      icon: <Users className="w-12 h-12 text-orange-500" />,
    },
    {
      id: 3,
      title: 'O que mais te interessa?',
      description: 'Selecione seus temas favoritos:',
      icon: <Sparkles className="w-12 h-12 text-orange-500" />,
    },
  ];

  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleGoalToggle = (goalId: string) => {
    setPreferences((prev) => {
      const goals = prev.goals.includes(goalId)
        ? prev.goals.filter((id) => id !== goalId)
        : prev.goals.length < 3
        ? [...prev.goals, goalId]
        : prev.goals;
      return { ...prev, goals };
    });
  };

  const handleInterestToggle = (interestId: string) => {
    setPreferences((prev) => {
      const interests = prev.interests.includes(interestId)
        ? prev.interests.filter((id) => id !== interestId)
        : [...prev.interests, interestId];
      return { ...prev, interests };
    });
  };

  const handlePhaseSelect = (phaseId: string) => {
    setPreferences((prev) => ({ ...prev, phase: phaseId }));
  };

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      await savePreferences();
      celebrateCompletion();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('clubnath_onboarding_completed', 'true');
    onComplete();
  };

  const savePreferences = async () => {
    try {
      if (user) {
        // Salvar preferências no perfil do usuário
        await supabase
          .from('profiles')
          .update({
            onboarding_completed: true,
            goals: preferences.goals,
            life_phase: preferences.phase,
            interests: preferences.interests,
          })
          .eq('id', user.id);

        localStorage.setItem('clubnath_onboarding_completed', 'true');
      }
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
    }
  };

  const celebrateCompletion = () => {
    // Pequena celebração antes de completar
    setIsAnimating(true);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true;
      case 1:
        return preferences.goals.length > 0;
      case 2:
        return preferences.phase !== '';
      case 3:
        return preferences.interests.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 z-50 overflow-y-auto">
      {/* Botão Pular */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1 text-sm transition-colors"
      >
        <X className="w-4 h-4" />
        Pular
      </button>

      {/* Barra de Progresso */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 sticky top-0 z-10">
        <div
          className="bg-gradient-to-r from-orange-500 to-pink-500 h-1 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Indicadores de Progresso */}
      <div className="max-w-md mx-auto pt-6 px-4">
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx <= currentStep
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 w-8'
                  : 'bg-gray-300 dark:bg-gray-600 w-2'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-md mx-auto px-4 pb-24">
        <div
          className={`transition-all duration-300 ${
            isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
          }`}
        >
          {/* Ícone */}
          <div className="flex justify-center mb-6 animate-fadeIn">
            {steps[currentStep].icon}
          </div>

          {/* Título e Descrição */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-3 animate-slideUp">
            {steps[currentStep].title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-8 animate-slideUp">
            {steps[currentStep].description}
          </p>

          {/* Step 0: Boas-vindas */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-orange-100 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Você está em um espaço seguro
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      O ClubNath é uma comunidade de mulheres que se apoiam mutuamente em suas jornadas de
                      crescimento, bem-estar e fé.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow text-center">
                  <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Comunidade</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Conecte-se com outras mulheres</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow text-center">
                  <BookHeart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Journaling</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Reflita e cresça</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow text-center">
                  <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Hábitos</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Alcance seus objetivos</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow text-center">
                  <Sparkles className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Inspiração</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Frases diárias</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Objetivos */}
          {currentStep === 1 && (
            <div className="space-y-3 animate-fadeIn">
              {GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalToggle(goal.id)}
                  disabled={!preferences.goals.includes(goal.id) && preferences.goals.length >= 3}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                    preferences.goals.includes(goal.id)
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-lg scale-105'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-300 dark:hover:border-orange-600'
                  } ${
                    !preferences.goals.includes(goal.id) && preferences.goals.length >= 3
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  <div
                    className={`flex-shrink-0 ${
                      preferences.goals.includes(goal.id) ? 'text-orange-500' : 'text-gray-400'
                    }`}
                  >
                    {goal.icon}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white flex-1 text-left">
                    {goal.label}
                  </span>
                  {preferences.goals.includes(goal.id) && (
                    <CheckCircle2 className="w-5 h-5 text-orange-500 animate-scaleIn" />
                  )}
                </button>
              ))}
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
                {preferences.goals.length}/3 selecionados
              </p>
            </div>
          )}

          {/* Step 2: Fase de Vida */}
          {currentStep === 2 && (
            <div className="space-y-3 animate-fadeIn">
              {LIFE_PHASES.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => handlePhaseSelect(phase.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${
                    preferences.phase === phase.id
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-lg scale-105'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-300 dark:hover:border-orange-600'
                  }`}
                >
                  <span className="font-medium text-gray-900 dark:text-white">{phase.label}</span>
                  {preferences.phase === phase.id && (
                    <CheckCircle2 className="w-5 h-5 text-orange-500 animate-scaleIn" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Interesses */}
          {currentStep === 3 && (
            <div className="space-y-3 animate-fadeIn">
              {INTERESTS.map((interest) => (
                <button
                  key={interest.id}
                  onClick={() => handleInterestToggle(interest.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                    preferences.interests.includes(interest.id)
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-lg scale-105'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-300 dark:hover:border-orange-600'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 ${
                      preferences.interests.includes(interest.id) ? 'text-orange-500' : 'text-gray-400'
                    }`}
                  >
                    {interest.icon}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white flex-1 text-left">
                    {interest.label}
                  </span>
                  {preferences.interests.includes(interest.id) && (
                    <CheckCircle2 className="w-5 h-5 text-orange-500 animate-scaleIn" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Botões de Navegação */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg">
        <div className="max-w-md mx-auto flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Voltar
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex-1 px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
              canProceed()
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-lg hover:scale-105'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentStep === totalSteps - 1 ? (
              <>
                Completar
                <Award className="w-5 h-5" />
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Celebração de Completamento */}
      {currentStep === totalSteps && isAnimating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm mx-4 text-center animate-scaleIn">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tudo pronto! 🎉</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Sua jornada no ClubNath está personalizada e pronta para começar.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
