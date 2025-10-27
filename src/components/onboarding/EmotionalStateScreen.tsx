/**
 * Nossa Maternidade - Tela 1A: Estado Emocional
 * "Como você está se sentindo hoje?"
 */

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useEssenceOnboarding } from '../../contexts/EssenceOnboardingContext';
import { EMOTIONAL_STATES, EmotionalState } from '../../types/essence-onboarding';
import { ChevronRight, Heart, CheckCircle } from 'lucide-react';

export const EmotionalStateScreen: React.FC = () => {
    const { setEmotionalState, nextStep } = useEssenceOnboarding();
    const [selectedState, setSelectedState] = useState<EmotionalState | null>(null);

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

    const handleSelect = useCallback((state: EmotionalState) => {
        triggerHaptic('light');
        setSelectedState(state);
        setEmotionalState(state);
    }, [setEmotionalState, triggerHaptic]);

    const handleNext = useCallback(() => {
        if (selectedState) {
            triggerHaptic('medium');
            nextStep();
        }
    }, [selectedState, nextStep, triggerHaptic]);

    return (
        <div className="text-center space-y-8">
            {/* Enhanced Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
            >
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                    className="relative w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-pink-500/30"
                >
                    <Heart className="w-10 h-10 text-white" />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8 }}
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 animate-ping opacity-30"
                    />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent leading-tight text-center"
                >
                    Como você está se sentindo hoje, querida?
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-gray-600 dark:text-gray-400 text-xl text-center leading-relaxed max-w-md mx-auto"
                >
                    Não há resposta certa — apenas o que é real neste momento da sua maternidade.
                </motion.p>
            </motion.div>

            {/* Enhanced Options */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-5"
            >
                {EMOTIONAL_STATES.map((state, index) => (
                    <motion.button
                        key={state.id}
                        initial={{ opacity: 0, x: -30, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{
                            delay: 1.0 + index * 0.15,
                            type: "spring",
                            stiffness: 100,
                            damping: 15
                        }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelect(state.id)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleSelect(state.id);
                            }
                        }}
                        className={`group relative w-full p-6 sm:p-8 rounded-3xl text-left transition-all duration-500 overflow-hidden touch-target ${selectedState === state.id
                            ? `bg-gradient-to-r ${state.color} shadow-2xl scale-105 border-2 border-pink-300 dark:border-pink-500`
                            : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-md hover:shadow-xl hover:scale-102 border border-gray-200/50 dark:border-gray-700/50'
                            }`}
                        tabIndex={0}
                        role="button"
                        aria-pressed={selectedState === state.id}
                        aria-label={`Selecionar estado emocional ${state.label}: ${state.description}`}
                    >
                        {/* Background Glow Effect */}
                        {selectedState === state.id && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-3xl"
                            />
                        )}

                        <div className="relative flex items-center gap-5">
                            <motion.div
                                className="text-5xl"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                {state.icon}
                            </motion.div>

                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                    {state.label}
                                </h3>
                                <p className="text-base text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors leading-relaxed">
                                    {state.description}
                                </p>
                            </div>

                            {selectedState === state.id && (
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-white"
                                    >
                                        <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                                    </motion.div>
                                </motion.div>
                            )}
                        </div>

                        {/* Hover Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                    </motion.button>
                ))}
            </motion.div>

            {/* Enhanced Next Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="pt-6"
            >
                <motion.button
                    onClick={handleNext}
                    disabled={!selectedState}
                    whileHover={selectedState ? { scale: 1.02, y: -2 } : {}}
                    whileTap={selectedState ? { scale: 0.98 } : {}}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleNext();
                        }
                    }}
                    className={`group relative w-full py-4 sm:py-5 px-6 sm:px-8 rounded-3xl font-bold text-lg sm:text-xl transition-all duration-500 overflow-hidden touch-target ${selectedState
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-2xl hover:shadow-pink-500/30 hover:shadow-2xl'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        }`}
                    aria-label={selectedState ? "Continuar para próxima etapa" : "Selecione um estado emocional para continuar"}
                    aria-disabled={!selectedState}
                >
                    {selectedState && (
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        />
                    )}

                    <div className="relative flex items-center justify-center gap-3">
                        <span>Próximo</span>
                        <motion.div
                            animate={selectedState ? { x: [0, 5, 0] } : {}}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </motion.div>
                    </div>
                </motion.button>

                {/* Selection Status */}
                {selectedState && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mt-4"
                    >
                        <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium">
                            <CheckCircle className="w-4 h-4" />
                            <span>Estado selecionado: {EMOTIONAL_STATES.find(s => s.id === selectedState)?.label}</span>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};
