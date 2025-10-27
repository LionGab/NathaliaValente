/**
 * Nossa Maternidade - Tela 3: Boas-Vindas Personalizada
 * Mensagem final baseada no arquétipo escolhido
 */

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useEssenceOnboarding } from '../../contexts/EssenceOnboardingContext';
import { Heart, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

export const PersonalizedWelcomeScreen: React.FC = () => {
    const {
        onboardingData,
        getPersonalizedMessage,
        getPersonalizedRitual,
        completeOnboarding
    } = useEssenceOnboarding();

    // Função para feedback háptico (vibração suave)
    const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
        if ('vibrate' in navigator) {
            const patterns = {
                light: [10],
                medium: [20],
                heavy: [30, 10, 30]
            };
            navigator.vibrate(patterns[type]);
        }
    }, []);

    const handleStartRitual = useCallback(() => {
        triggerHaptic('heavy');
        completeOnboarding();
        // Aqui você redirecionaria para a primeira atividade personalizada
        console.log('Iniciando atividade:', getPersonalizedRitual());
    }, [completeOnboarding, getPersonalizedRitual, triggerHaptic]);

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
                return 'from-red-50 to-rose-50';
            case 'resiliente':
                return 'from-purple-50 to-violet-50';
            case 'visionaria':
                return 'from-blue-50 to-cyan-50';
            case 'cuidadora':
                return 'from-green-50 to-emerald-50';
            default:
                return 'from-pink-50 to-purple-50';
        }
    };

    return (
        <div className="text-center space-y-8">
            {/* Background with Archetype */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className={`relative p-8 rounded-3xl bg-gradient-to-br ${getArchetypeColor()} dark:from-gray-800 dark:to-gray-900 border border-gray-200/50 dark:border-gray-700/50`}
            >
                {/* Archetype Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    className="text-8xl mb-6"
                >
                    {getArchetypeIcon()}
                </motion.div>

                {/* Personalized Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-6"
                >
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white leading-relaxed px-4">
                        Bem-vinda à Nossa Maternidade
                    </h1>

                    <blockquote className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic px-4">
                        "{getPersonalizedMessage()}"
                    </blockquote>
                </motion.div>

                {/* Sparkles Animation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="absolute top-4 right-4"
                >
                    <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                </motion.div>
            </motion.div>

            {/* Ritual Information */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="space-y-4"
            >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Heart className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Seu Primeiro Ritual
                        </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {getPersonalizedRitual()} - Um momento especial criado especialmente para você
                    </p>
                </div>
            </motion.div>

            {/* Enhanced Start Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="pt-6"
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
                    className="group relative w-full py-4 sm:py-5 px-6 sm:px-8 rounded-3xl font-bold text-base sm:text-lg md:text-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-2xl hover:shadow-pink-500/30 hover:shadow-2xl transition-all duration-500 overflow-hidden touch-target"
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

                    <div className="relative flex items-center justify-center gap-3">
                        <span>Começar minha primeira atividade</span>
                        <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </motion.div>
                    </div>
                </motion.button>

                {/* Completion Status */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="text-center mt-4"
                >
                    <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        <span>Onboarding completo! Bem-vinda à Nossa Maternidade</span>
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
