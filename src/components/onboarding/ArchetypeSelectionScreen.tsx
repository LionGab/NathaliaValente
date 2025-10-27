/**
 * Nossa Maternidade - Tela 2: Seleção de Arquétipos Maternais
 * "Qual destas essências mais se parece com você hoje?"
 */

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useEssenceOnboarding } from '../../contexts/EssenceOnboardingContext';
import { FEMININE_ARCHETYPES, FeminineArchetype } from '../../types/essence-onboarding';
import { ChevronRight, ChevronLeft, Crown, Play, Pause, CheckCircle } from 'lucide-react';

export const ArchetypeSelectionScreen: React.FC = () => {
    const { setSelectedArchetype, nextStep, previousStep } = useEssenceOnboarding();
    const [selectedArchetype, setSelectedArchetypeLocal] = useState<FeminineArchetype | null>(null);
    const [playingAudio, setPlayingAudio] = useState<FeminineArchetype | null>(null);

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

    const handleSelect = useCallback((archetype: FeminineArchetype) => {
        triggerHaptic('light');
        setSelectedArchetypeLocal(archetype);
        setSelectedArchetype(archetype);
    }, [setSelectedArchetype, triggerHaptic]);

    const handlePlayAudio = useCallback((archetype: FeminineArchetype, event: React.MouseEvent) => {
        event.stopPropagation();
        triggerHaptic('light');

        if (playingAudio === archetype) {
            setPlayingAudio(null);
            // Aqui você implementaria a lógica para parar o áudio
        } else {
            setPlayingAudio(archetype);
            // Aqui você implementaria a lógica para tocar o áudio
            // Por enquanto, vamos simular com um timeout
            setTimeout(() => {
                setPlayingAudio(null);
            }, 3000);
        }
    }, [playingAudio, triggerHaptic]);

    const handleNext = useCallback(() => {
        if (selectedArchetype) {
            triggerHaptic('medium');
            nextStep();
        }
    }, [selectedArchetype, nextStep, triggerHaptic]);

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
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                    className="relative w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/30"
                >
                    <Crown className="w-10 h-10 text-white" />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8 }}
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 animate-ping opacity-30"
                    />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent leading-tight text-center px-4"
                >
                    Qual destas essências mais se parece com você hoje?
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-gray-600 dark:text-gray-400 text-base sm:text-lg md:text-xl text-center leading-relaxed max-w-lg mx-auto px-4"
                >
                    Cada mãe tem sua própria força única. Descubra a sua.
                </motion.p>
            </motion.div>

            {/* Enhanced Archetype Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
            >
                {FEMININE_ARCHETYPES.map((archetype, index) => (
                    <motion.div
                        key={archetype.id}
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
                        className={`group relative p-6 sm:p-8 rounded-3xl text-left transition-all duration-500 cursor-pointer overflow-hidden touch-target ${selectedArchetype === archetype.id
                            ? `bg-gradient-to-r ${archetype.color} shadow-2xl scale-105 border-2 border-indigo-300 dark:border-indigo-500`
                            : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-md hover:shadow-xl hover:scale-102 border border-gray-200/50 dark:border-gray-700/50'
                            }`}
                        onClick={() => handleSelect(archetype.id)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleSelect(archetype.id);
                            }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-pressed={selectedArchetype === archetype.id}
                        aria-label={`Selecionar arquétipo ${archetype.label}: ${archetype.description}`}
                    >
                        {/* Background Glow Effect */}
                        {selectedArchetype === archetype.id && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-3xl"
                            />
                        )}

                        {/* Enhanced Audio Play Button */}
                        <motion.button
                            onClick={(e) => handlePlayAudio(archetype.id, e)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handlePlayAudio(archetype.id, e as any);
                                }
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-white/90 dark:bg-gray-700/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-600 transition-colors shadow-lg border border-gray-200/50 dark:border-gray-600/50 touch-target"
                            aria-label={playingAudio === archetype.id ? `Parar áudio de ${archetype.label}` : `Tocar áudio de ${archetype.label}`}
                            tabIndex={0}
                        >
                            {playingAudio === archetype.id ? (
                                <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
                            ) : (
                                <Play className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
                            )}
                        </motion.button>

                        <div className="pr-16">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                {archetype.label}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed text-sm sm:text-base md:text-lg group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                                {archetype.description}
                            </p>

                            {/* Enhanced Traits */}
                            <div className="flex flex-wrap gap-3">
                                {archetype.traits.map((trait, traitIndex) => (
                                    <motion.span
                                        key={traitIndex}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1.2 + index * 0.1 + traitIndex * 0.05 }}
                                        className="px-4 py-2 bg-white/70 dark:bg-gray-700/70 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-md hover:shadow-lg transition-all duration-300"
                                    >
                                        {trait}
                                    </motion.span>
                                ))}
                            </div>
                        </div>

                        {/* Enhanced Selection Indicator */}
                        {selectedArchetype === archetype.id && (
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className="absolute top-4 left-4 sm:top-6 sm:left-6 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800"
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

                        {/* Enhanced Audio Playing Indicator */}
                        {playingAudio === archetype.id && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-6 right-6 flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 bg-white/80 dark:bg-gray-700/80 px-3 py-2 rounded-full shadow-md"
                            >
                                <div className="flex gap-1">
                                    <motion.div
                                        className="w-1 h-4 bg-indigo-500 rounded-full"
                                        animate={{ scaleY: [1, 0.5, 1] }}
                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                    />
                                    <motion.div
                                        className="w-1 h-4 bg-indigo-500 rounded-full"
                                        animate={{ scaleY: [1, 0.5, 1] }}
                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                    />
                                    <motion.div
                                        className="w-1 h-4 bg-indigo-500 rounded-full"
                                        animate={{ scaleY: [1, 0.5, 1] }}
                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                    />
                                </div>
                                <span className="font-medium">Ouvindo...</span>
                            </motion.div>
                        )}

                        {/* Hover Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                    </motion.div>
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
                    disabled={!selectedArchetype}
                    whileHover={selectedArchetype ? { scale: 1.02 } : {}}
                    whileTap={selectedArchetype ? { scale: 0.98 } : {}}
                    className={`flex-1 py-4 px-6 sm:px-8 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 touch-target flex items-center justify-center gap-2 ${selectedArchetype
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        }`}
                    aria-label={selectedArchetype ? "Continuar para próxima etapa" : "Selecione um arquétipo para continuar"}
                    aria-disabled={!selectedArchetype}
                >
                    <span>Continuar</span>
                    <ChevronRight className="w-5 h-5" />
                </motion.button>
            </motion.div>

            {/* Selection Status */}
            {selectedArchetype && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        <span>Arquétipo selecionado: {FEMININE_ARCHETYPES.find(a => a.id === selectedArchetype)?.label}</span>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
