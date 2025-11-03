/**
 * ClubNath VIP - Modern Progress Indicator
 * Indicador de progresso moderno e elegante
 */

import { Check } from 'lucide-react';

interface ModernProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const ModernProgressIndicator = ({
  currentStep,
  totalSteps,
}: ModernProgressIndicatorProps) => {
  return (
    <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/20 dark:border-gray-700/20">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div key={index} className="flex items-center">
          {/* Step Circle */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
              index < currentStep
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                : index === currentStep
                  ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-md animate-pulse'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}
          >
            {index < currentStep ? <Check className="w-4 h-4" strokeWidth={3} /> : index + 1}
          </div>

          {/* Connector Line */}
          {index < totalSteps - 1 && (
            <div
              className={`w-6 h-0.5 mx-2 transition-all duration-300 ${
                index < currentStep
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
