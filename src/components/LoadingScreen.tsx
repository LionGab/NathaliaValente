import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Carregando...",
  showProgress = false,
  progress = 0
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-neutral-900 dark:via-primary-950 dark:to-secondary-950 flex items-center justify-center relative overflow-hidden">
      {/* Modern Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-200/20 dark:bg-primary-800/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-200/20 dark:bg-secondary-800/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-200/10 dark:bg-accent-800/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="flex flex-col items-center gap-8 p-8 relative z-10">
        {/* Logo animado - Modern */}
        <div className="relative">
          <div className="w-24 h-24 bg-white dark:bg-neutral-800 rounded-3xl flex items-center justify-center shadow-large mx-auto animate-float overflow-hidden">
            <img
              src="/logos/clubnath-logo.png"
              alt="Nossa Maternidade"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Título */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-3 tracking-tight">
            Nossa Maternidade
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300 text-lg font-medium">
            {message}
          </p>
        </div>

        {/* Loading spinner - Modern */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-primary-200 dark:border-primary-800 rounded-full animate-spin border-t-transparent border-r-transparent"></div>
          <div className="absolute inset-2 border-4 border-secondary-200 dark:border-secondary-800 rounded-full animate-spin border-t-transparent border-l-transparent" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="absolute inset-4 border-4 border-accent-200 dark:border-accent-800 rounded-full animate-spin border-b-transparent border-r-transparent" style={{ animationDuration: '2s' }}></div>
        </div>

        {/* Progress bar */}
        {showProgress && (
          <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Dicas rotativas */}
        <div className="text-center max-w-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
            💡 Dica: Conecte-se com outras mães e receba suporte da Nath
          </p>
        </div>
      </div>
    </div>
  );
};
