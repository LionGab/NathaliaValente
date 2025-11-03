/**
 * Nossa Maternidade - Tela 1B: Desejos e Necessidades
 * "O que você mais quer neste momento?"
 */

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useEssenceOnboarding } from '../../contexts/EssenceOnboardingContext';
import { DESIRE_OPTIONS, CurrentDesire } from '../../types/essence-onboarding';
import { ChevronRight, ChevronLeft, Sparkles, CheckCircle } from 'lucide-react';

export const DesireScreen: React.FC = () => {
  const { setCurrentDesire, nextStep, previousStep } = useEssenceOnboarding();
  const [selectedDesire, setSelectedDesire] = useState<CurrentDesire | null>(null);

  // Função para feedback háptico (vibração suave)
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30, 10, 30],
      };
      navigator.vibrate(patterns[type]);
    }
  }, []);

  const handleSelect = useCallback(
    (desire: CurrentDesire) => {
      triggerHaptic('light');
      setSelectedDesire(desire);
      setCurrentDesire(desire);
    },
    [setCurrentDesire, triggerHaptic]
  );

  const handleNext = useCallback(() => {
    if (selectedDesire) {
      triggerHaptic('medium');
      nextStep();
    }
  }, [selectedDesire, nextStep, triggerHaptic]);

  const handlePrevious = useCallback(() => {
    triggerHaptic('light');
    previousStep();
  }, [previousStep, triggerHaptic]);

  return (
    <div className="text-center space-y-4 sm:space-y-6">
      {/* Mobile-Optimized Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3 sm:space-y-4"
      >
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-secondary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 maternal-shadow-lg"
        >
          <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary-500 to-primary-600 animate-ping opacity-30"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent leading-tight text-center px-2"
        >
          O que você mais quer neste momento?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-gray-600 dark:text-gray-400 text-sm sm:text-base text-center leading-relaxed max-w-sm mx-auto px-2"
        >
          Isso vai nos ajudar a criar um espaço feito sob medida para você.
        </motion.p>
      </motion.div>

      {/* Mobile-Optimized Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3 sm:space-y-4"
      >
        {DESIRE_OPTIONS.map((desire, index) => (
          <motion.button
            key={desire.id}
            initial={{ opacity: 0, x: -30, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              delay: 0.6 + index * 0.1,
              type: 'spring',
              stiffness: 100,
              damping: 15,
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(desire.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelect(desire.id);
              }
            }}
            className={`group relative w-full p-4 sm:p-6 rounded-2xl text-left transition-all duration-300 overflow-hidden min-h-[80px] ${
              selectedDesire === desire.id
                ? `bg-gradient-to-r ${desire.color} shadow-xl scale-105 border-2 border-purple-300 dark:border-purple-500`
                : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-md hover:shadow-lg border border-gray-200/50 dark:border-gray-700/50'
            }`}
            tabIndex={0}
            role="button"
            aria-pressed={selectedDesire === desire.id}
            aria-label={`Selecionar desejo ${desire.label}: ${desire.description}`}
            aria-describedby={`desire-${desire.id}-description`}
          >
            {/* Background Glow Effect */}
            {selectedDesire === desire.id && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-2xl"
              />
            )}

            <div className="relative flex items-center gap-3 sm:gap-4">
              <motion.div
                className="text-3xl sm:text-4xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {desire.icon}
              </motion.div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-1 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {desire.label}
                </h3>
                <p
                  id={`desire-${desire.id}-description`}
                  className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors leading-relaxed line-clamp-2"
                >
                  {desire.description}
                </p>
              </div>

              {selectedDesire === desire.id && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800 flex-shrink-0"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-white"
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
          </motion.button>
        ))}
      </motion.div>

      {/* Mobile-Optimized Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6"
      >
        <motion.button
          onClick={handlePrevious}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 sm:py-4 px-6 rounded-2xl font-semibold text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 min-h-[48px] flex items-center justify-center gap-2"
          aria-label="Voltar para etapa anterior"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Voltar</span>
        </motion.button>

        <motion.button
          onClick={handleNext}
          disabled={!selectedDesire}
          whileHover={selectedDesire ? { scale: 1.02 } : {}}
          whileTap={selectedDesire ? { scale: 0.98 } : {}}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleNext();
            }
          }}
          className={`flex-1 py-3 sm:py-4 px-6 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 min-h-[48px] flex items-center justify-center gap-2 ${
            selectedDesire
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
          aria-label={
            selectedDesire ? 'Continuar para próxima etapa' : 'Selecione um desejo para continuar'
          }
          aria-disabled={!selectedDesire}
          role="button"
        >
          <span>Continuar</span>
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
      </motion.div>

      {/* Selection Status - Mobile Optimized */}
      {selectedDesire && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            <span className="truncate max-w-[200px] sm:max-w-none">
              {DESIRE_OPTIONS.find((d) => d.id === selectedDesire)?.label}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
