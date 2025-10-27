/**
 * ClubNath VIP - Modern Welcome Screen
 * Tela de boas-vindas moderna e elegante
 */

import { Heart, Sparkles, ArrowRight, X } from 'lucide-react';

interface ModernWelcomeScreenProps {
  onNext: () => void;
  onSkip: () => void;
}

export const ModernWelcomeScreen = ({ onNext, onSkip }: ModernWelcomeScreenProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Skip Button */}
      <button
        onClick={onSkip}
        className="absolute top-8 right-8 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        aria-label="Pular onboarding"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto space-y-8">
        {/* Logo/Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-pink-500 to-purple-600 p-8 rounded-3xl shadow-2xl">
            <Heart className="w-20 h-20 text-white fill-white" />
          </div>
          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Welcome Message */}
        <div className="space-y-6">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white tracking-tight">
            Bem-vinda ao{' '}
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Nossa Maternidade
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 font-medium max-w-lg mx-auto leading-relaxed">
            Criado pela Nathália Valente, para mães especiais como você
          </p>

          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Um espaço seguro de{' '}
            <span className="font-semibold text-purple-600 dark:text-purple-400">fé</span>,{' '}
            <span className="font-semibold text-pink-600 dark:text-pink-400">autenticidade</span> e{' '}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">sororidade</span>
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <div className="group bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">💬</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Conecte-se</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Faça parte de uma comunidade acolhedora de mães
            </p>
          </div>

          <div className="group bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🙏</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Fortalecer sua fé</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Cresça espiritualmente no seu dia a dia
            </p>
          </div>

          <div className="group bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">✨</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Seja você</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Um espaço seguro para ser autêntica
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4 mt-12 max-w-md mx-auto">
          <button
            onClick={onNext}
            className="group w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <span>Começar minha jornada</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>

          <button
            onClick={onSkip}
            className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium py-3 px-6 rounded-xl transition-colors duration-200"
          >
            Pular tour
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 text-6xl opacity-10 dark:opacity-5 animate-pulse">
        💕
      </div>
      <div className="absolute bottom-20 right-20 text-6xl opacity-10 dark:opacity-5 animate-pulse" style={{ animationDelay: '1s' }}>
        🌸
      </div>
      <div className="absolute top-1/2 left-10 text-4xl opacity-10 dark:opacity-5 animate-pulse" style={{ animationDelay: '2s' }}>
        ✨
      </div>
    </div>
  );
};
