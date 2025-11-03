/**
 * Nossa Maternidade - Tela 3: Boas-Vindas Personalizada
 * Mensagem final baseada no arquétipo escolhido
 */

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useEssenceOnboarding } from '../../contexts/EssenceOnboardingContext';
import { Heart, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

export const PersonalizedWelcomeScreen: React.FC = () => {
  const { onboardingData, getPersonalizedMessage, getPersonalizedActivity, completeOnboarding } =
    useEssenceOnboarding();

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

  const handleStartRitual = useCallback(() => {
    triggerHaptic('heavy');
    completeOnboarding();
    // Aqui você redirecionaria para a primeira atividade personalizada
    console.log('Iniciando atividade:', getPersonalizedActivity());
  }, [completeOnboarding, getPersonalizedActivity, triggerHaptic]);

  const getArchetypeIcon = () => {
    switch (onboardingData.selectedArchetype) {
      case 'guerreira':
        return '⚔️';
      case 'resiliente':
        return '🌱';
      case 'visionaria':
        return '👁️';
      case 'cuidadora':
        return '🤱';
      default:
        return '✨';
    }
  };

  const getArchetypeColor = () => {
    switch (onboardingData.selectedArchetype) {
      case 'guerreira':
        return 'from-error-50 to-primary-100';
      case 'resiliente':
        return 'from-secondary-50 to-maternity-baby-100';
      case 'visionaria':
        return 'from-accent-50 to-maternity-nature-100';
      case 'cuidadora':
        return 'from-success-50 to-maternity-nature-100';
      default:
        return 'from-primary-50 to-secondary-100';
    }
  };

  return (
    <div className="text-center space-y-4 sm:space-y-6">
      {/* Mobile-Optimized Background with Archetype */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className={`relative p-4 sm:p-6 rounded-2xl bg-gradient-to-br ${getArchetypeColor()} dark:from-gray-800 dark:to-gray-900 border border-gray-200/50 dark:border-gray-700/50`}
      >
        {/* Mobile-Optimized Archetype Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          className="text-5xl sm:text-6xl mb-4 sm:mb-6"
        >
          {getArchetypeIcon()}
        </motion.div>

        {/* Mobile-Optimized Personalized Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3 sm:space-y-4"
        >
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white leading-relaxed px-2">
            Bem-vinda à Nossa Maternidade
          </h1>

          <blockquote className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed italic px-2">
            "{getPersonalizedMessage()}"
          </blockquote>
        </motion.div>

        {/* Mobile-Optimized Sparkles Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute top-3 right-3 sm:top-4 sm:right-4"
        >
          <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-500 animate-pulse" />
        </motion.div>
      </motion.div>

      {/* Mobile-Optimized Ritual Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="space-y-3 sm:space-y-4"
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
              Seu Primeiro Ritual
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
            {getPersonalizedActivity()} - Um momento especial criado especialmente para você
          </p>
        </div>
      </motion.div>

      {/* Mobile-Optimized Start Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="pt-4 sm:pt-6"
      >
        <motion.button
          onClick={handleStartRitual}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleStartRitual();
            }
          }}
          className="group relative w-full py-3 sm:py-4 px-6 rounded-2xl font-bold text-sm sm:text-base bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl hover:shadow-pink-500/30 transition-all duration-300 overflow-hidden min-h-[48px]"
          aria-label="Iniciar sua primeira atividade personalizada"
          role="button"
        >
          {/* Shimmer Effect */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />

          <div className="relative flex items-center justify-center gap-2">
            <span className="truncate">Começar minha primeira atividade</span>
            <motion.div animate={{ x: [0, 3, 0] }} transition={{ duration: 1, repeat: Infinity }}>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.div>
          </div>
        </motion.button>

        {/* Mobile-Optimized Completion Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="text-center mt-3"
        >
          <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            <span className="truncate max-w-[250px] sm:max-w-none">
              Onboarding completo! Bem-vinda à Nossa Maternidade
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="text-sm text-gray-500 dark:text-gray-400 space-y-2"
      >
        <p>✨ Sua jornada personalizada começa agora</p>
        <p>💕 Você pode alterar suas preferências a qualquer momento</p>
      </motion.div>
    </div>
  );
};
