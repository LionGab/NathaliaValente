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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 p-8">
        {/* Logo animado */}
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
            <Heart className="w-10 h-10 text-white fill-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
            <Sparkles className="w-3 h-3 text-yellow-800" />
          </div>
        </div>

        {/* Título */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            ClubNath
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {message}
          </p>
        </div>

        {/* Loading spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-pink-200 dark:border-pink-800 rounded-full animate-spin border-t-pink-500"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-spin border-t-purple-500" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
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
