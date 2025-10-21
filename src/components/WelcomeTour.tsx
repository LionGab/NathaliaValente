import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Heart, MessageCircle, Search, Sparkles, User, Check } from 'lucide-react';

interface TourStep {
  id: number;
  target: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  position: 'top' | 'bottom' | 'center';
}

interface WelcomeTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 0,
    target: 'welcome',
    title: 'Bem-vinda ao ClubNath!',
    description: 'Vamos fazer um tour rápido de 60 segundos pelos principais recursos. Você pode pular a qualquer momento.',
    icon: <Heart className="w-8 h-8 text-orange-500" />,
    position: 'center',
  },
  {
    id: 1,
    target: 'feed',
    title: 'Feed da Comunidade',
    description: 'Aqui você encontra posts inspiradores de outras mulheres da comunidade. Compartilhe suas experiências, conquistas e reflexões.',
    icon: <Heart className="w-6 h-6 text-orange-500" />,
    position: 'bottom',
  },
  {
    id: 2,
    target: 'chat',
    title: 'Chat com Robô Nath',
    description: 'Converse com nossa assistente virtual sobre fé, bem-estar e crescimento pessoal. Ela está aqui para apoiar você!',
    icon: <MessageCircle className="w-6 h-6 text-pink-500" />,
    position: 'bottom',
  },
  {
    id: 3,
    target: 'search',
    title: 'Buscar Conteúdo',
    description: 'Procure posts por temas, palavras-chave ou categorias específicas. Encontre exatamente o que precisa.',
    icon: <Search className="w-6 h-6 text-purple-500" />,
    position: 'bottom',
  },
  {
    id: 4,
    target: 'daily',
    title: 'Frase do Dia',
    description: 'Receba inspiração diária com frases motivacionais e reflexões. Comece seu dia com energia positiva!',
    icon: <Sparkles className="w-6 h-6 text-yellow-500" />,
    position: 'bottom',
  },
  {
    id: 5,
    target: 'profile',
    title: 'Seu Perfil',
    description: 'Gerencie seus hábitos, journaling, configurações e veja seu progresso pessoal. Seu espaço privado de crescimento.',
    icon: <User className="w-6 h-6 text-blue-500" />,
    position: 'bottom',
  },
];

export default function WelcomeTour({ onComplete, onSkip }: WelcomeTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const currentStepData = TOUR_STEPS[currentStep];
  const totalSteps = TOUR_STEPS.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('clubnath_tour_completed', 'true');
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  const handleSkipTour = () => {
    localStorage.setItem('clubnath_tour_completed', 'true');
    setIsVisible(false);
    setTimeout(onSkip, 300);
  };

  // Teclas de atalho
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkipTour();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  if (!isVisible) return null;

  // Tour de boas-vindas (step 0 - centro da tela)
  if (currentStep === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-scaleIn">
          <button
            onClick={handleSkipTour}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-6">{currentStepData.icon}</div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
            {currentStepData.title}
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-center mb-8">{currentStepData.description}</p>

          <div className="flex gap-3">
            <button
              onClick={handleSkipTour}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Pular Tour
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Começar
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tooltips contextuais para cada elemento
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Overlay escuro com destaque no elemento */}
      <div
        className="absolute inset-0 bg-black/60 animate-fadeIn"
        onClick={handleSkipTour}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSkipTour();
          }
        }}
      />

      {/* Tooltip */}
      <div
        className={`absolute pointer-events-auto ${
          currentStepData.position === 'bottom'
            ? 'bottom-24 left-1/2 transform -translate-x-1/2'
            : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
        }`}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm mx-4 shadow-2xl animate-slideUp border-2 border-orange-500">
          {/* Botão Fechar */}
          <button
            onClick={handleSkipTour}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Ícone */}
          <div className="flex items-center gap-3 mb-4">
            {currentStepData.icon}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{currentStepData.title}</h3>
          </div>

          {/* Descrição */}
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{currentStepData.description}</p>

          {/* Progresso */}
          <div className="flex items-center gap-2 mb-4">
            {TOUR_STEPS.map((step, idx) => (
              <div
                key={step.id}
                className={`h-1.5 rounded-full flex-1 transition-colors duration-300 ${
                  idx <= currentStep
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Navegação */}
          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="px-4 py-2 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {currentStep === totalSteps - 1 ? (
                <>
                  Finalizar
                  <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  Próximo ({currentStep + 1}/{totalSteps})
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Seta apontando para o elemento (quando position é bottom) */}
        {currentStepData.position === 'bottom' && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="w-4 h-4 bg-orange-500 rotate-45"></div>
          </div>
        )}
      </div>
    </div>
  );
}
