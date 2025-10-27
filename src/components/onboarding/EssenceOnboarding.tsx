/**
 * Nossa Maternidade - Onboarding "Essência"
 * Sistema emocional de conexão pessoal e descoberta da identidade feminina
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEssenceOnboarding } from '../../contexts/EssenceOnboardingContext';
import { EmotionalStateScreen } from './EmotionalStateScreen';
import { DesireScreen } from './DesireScreen';
import { ArchetypeSelectionScreen } from './ArchetypeSelectionScreen';
import { PersonalizedWelcomeScreen } from './PersonalizedWelcomeScreen';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export const EssenceOnboarding: React.FC = () => {
  const {
    currentStep,
    isOnboardingActive,
    isOnboardingComplete,
    onboardingData
  } = useEssenceOnboarding();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <span className="text-3xl">✨</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Preparando sua jornada
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Criando um espaço único para você...
          </p>
        </div>
      </div>
    );
  }

  if (!isOnboardingActive || isOnboardingComplete) {
    return null;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <EmotionalStateScreen />;
      case 2:
        return <DesireScreen />;
      case 3:
        return <ArchetypeSelectionScreen />;
      case 4:
        return <PersonalizedWelcomeScreen />;
      default:
        return <EmotionalStateScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-pink-200/30 to-rose-300/20 dark:from-pink-800/20 dark:to-rose-900/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-violet-300/20 dark:from-purple-800/20 dark:to-violet-900/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '1s' }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-200/20 to-cyan-300/10 dark:from-indigo-800/10 dark:to-cyan-900/5 rounded-full blur-3xl animate-pulse"></div>

        {/* Additional Floating Elements */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-yellow-200/20 to-orange-300/10 dark:from-yellow-800/10 dark:to-orange-900/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-br from-green-200/20 to-emerald-300/10 dark:from-green-800/10 dark:to-emerald-900/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }}></div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)]"></div>
      </div>

      {/* Enhanced Progress Indicator */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full px-6 py-3 shadow-xl border border-white/20 dark:border-gray-700/20"
        >
          {[1, 2, 3, 4].map((step) => (
            <motion.div
              key={step}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 + step * 0.1 }}
              className={`relative w-4 h-4 rounded-full transition-all duration-500 ${step <= currentStep
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 scale-110 shadow-lg shadow-pink-500/30'
                  : 'bg-gray-300 dark:bg-gray-600'
                }`}
            >
              {step <= currentStep && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 animate-ping opacity-75"
                />
              )}
            </motion.div>
          ))}
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 ml-2">
            {currentStep}/4
          </div>
        </motion.div>
      </div>

      {/* Enhanced Skip Button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        onClick={() => {
          const { skipOnboarding } = useEssenceOnboarding();
          skipOnboarding();
        }}
        className="absolute top-8 right-8 z-10 group"
      >
        <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20 dark:border-gray-700/20">
          <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors text-sm font-medium">
            Pular
          </span>
          <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full group-hover:bg-gray-600 dark:group-hover:bg-gray-300 transition-colors"></div>
        </div>
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full max-w-md"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
