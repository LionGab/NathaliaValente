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
                heavy: [30, 10, 30]
            };
            navigator.vibrate(patterns[type]);
        }
    }, []);

    const handleSelect = useCallback((desire: CurrentDesire) => {
        triggerHaptic('light');
        setSelectedDesire(desire);
        setCurrentDesire(desire);
    }, [setCurrentDesire, triggerHaptic]);

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
        <div className="text-center space-y-8">
            {/* Enhanced Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
            >
                <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                    className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/30"
                >
                    <Sparkles className="w-10 h-10 text-white" />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8 }}
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 animate-ping opacity-30"
                    />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent leading-tight text-center"
                >
                    O que você mais quer neste momento?
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-gray-600 dark:text-gray-400 text-xl text-center leading-relaxed max-w-lg mx-auto"
                >
                    Isso vai nos ajudar a criar um espaço feito sob medida para sua jornada materna.
                </motion.p>
            </motion.div>

            {/* Enhanced Options */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-5"
            >
                {DESIRE_OPTIONS.map((desire, index) => (
                    <motion.button
                        key={desire.id}
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
                        onClick={() => handleSelect(desire.id)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleSelect(desire.id);
                            }
                        }}
                        className={`group relative w-full p-6 sm:p-8 rounded-3xl text-left transition-all duration-500 overflow-hidden touch-target ${selectedDesire === desire.id
                            ? `bg-gradient-to-r ${desire.color} shadow-2xl scale-105 border-2 border-purple-300 dark:border-purple-500`
                            : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-md hover:shadow-xl hover:scale-102 border border-gray-200/50 dark:border-gray-700/50'
                            }`}
                        tabIndex={0}
                        role="button"
                        aria-pressed={selectedDesire === desire.id}
                        aria-label={`Selecionar desejo ${desire.label}: ${desire.description}`}
                    >
                        {/* Background Glow Effect */}
                        {selectedDesire === desire.id && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-3xl"
                            />
                        )}

                        <div className="relative flex items-center gap-5">
                            <motion.div
                                className="text-5xl"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                {desire.icon}
                            </motion.div>

                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                    {desire.label}
                                </h3>
                                <p className="text-base text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors leading-relaxed">
                                    {desire.description}
                                </p>
                            </div>

                            {selectedDesire === desire.id && (
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800"
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

            {/* Enhanced Navigation Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="flex flex-col sm:flex-row gap-4 pt-6"
            >
                <motion.button
                    onClick={handlePrevious}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-4 px-6 sm:px-8 rounded-2xl font-semibold text-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 touch-target flex items-center justify-center gap-2"
                    aria-label="Voltar para etapa anterior"
                >
                    <ChevronLeft className="w-5 h-5" />
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
                    className={`flex-1 py-4 px-6 sm:px-8 rounded-2xl font-semibold text-lg transition-all duration-300 touch-target flex items-center justify-center gap-2 ${selectedDesire
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        }`}
                    aria-label={selectedDesire ? "Continuar para próxima etapa" : "Selecione um desejo para continuar"}
                    aria-disabled={!selectedDesire}
                >
                    <span>Continuar</span>
                    <ChevronRight className="w-5 h-5" />
                </motion.button>
            </motion.div>

            {/* Selection Status */}
            {selectedDesire && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        <span>Desejo selecionado: {DESIRE_OPTIONS.find(d => d.id === selectedDesire)?.label}</span>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
