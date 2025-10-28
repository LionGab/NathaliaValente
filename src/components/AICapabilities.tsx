import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    Heart,
    Search,
    BookOpen,
    Dumbbell,
    Moon,
    Apple,
    Baby,
    Sparkles,
    Zap,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

interface AICapability {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
    examples: string[];
}

const capabilities: AICapability[] = [
    {
        id: 'emotional-support',
        title: 'Apoio Emocional',
        description: 'Análise de humor e suporte emocional personalizado',
        icon: Heart,
        color: 'from-pink-500 to-rose-500',
        examples: [
            'Me sinto sobrecarregada com a maternidade',
            'Estou com medo do parto',
            'Não consigo dormir por causa da ansiedade'
        ]
    },
    {
        id: 'pregnancy-advice',
        title: 'Conselhos de Gravidez',
        description: 'Orientações específicas por trimestre gestacional',
        icon: Baby,
        color: 'from-blue-500 to-cyan-500',
        examples: [
            'O que posso comer no 2º trimestre?',
            'Exercícios seguros para 30 semanas',
            'Sintomas normais da gravidez'
        ]
    },
    {
        id: 'postpartum-care',
        title: 'Cuidados Pós-Parto',
        description: 'Suporte especializado no período pós-parto',
        icon: Sparkles,
        color: 'from-purple-500 to-violet-500',
        examples: [
            'Como cuidar do períneo após o parto',
            'Dicas para amamentação',
            'Recuperação pós-cesárea'
        ]
    },
    {
        id: 'nutrition',
        title: 'Nutrição Materna',
        description: 'Conselhos nutricionais para mães e bebês',
        icon: Apple,
        color: 'from-green-500 to-emerald-500',
        examples: [
            'Alimentos que aumentam o leite materno',
            'Dieta para gestante com diabetes',
            'Introdução alimentar do bebê'
        ]
    },
    {
        id: 'exercise',
        title: 'Exercícios Seguros',
        description: 'Recomendações de atividade física adaptada',
        icon: Dumbbell,
        color: 'from-orange-500 to-red-500',
        examples: [
            'Yoga para gestantes',
            'Exercícios pós-parto',
            'Atividades com o bebê'
        ]
    },
    {
        id: 'sleep',
        title: 'Dicas de Sono',
        description: 'Estratégias para melhorar o descanso',
        icon: Moon,
        color: 'from-indigo-500 to-blue-500',
        examples: [
            'Como dormir melhor na gravidez',
            'Rotina de sono do bebê',
            'Cochilos durante o dia'
        ]
    },
    {
        id: 'web-search',
        title: 'Pesquisa Web',
        description: 'Busca informações atualizadas na internet',
        icon: Search,
        color: 'from-teal-500 to-cyan-500',
        examples: [
            'Últimas pesquisas sobre amamentação',
            'Novos tratamentos para cólicas',
            'Tendências em cuidados infantis'
        ]
    },
    {
        id: 'learning',
        title: 'Educação Contínua',
        description: 'Recursos educativos e estudos personalizados',
        icon: BookOpen,
        color: 'from-amber-500 to-yellow-500',
        examples: [
            'Estudos bíblicos para mães',
            'Cursos de primeiros socorros',
            'Desenvolvimento infantil'
        ]
    }
];

export const AICapabilities: React.FC = () => {
    const [expandedCapability, setExpandedCapability] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);

    const visibleCapabilities = showAll ? capabilities : capabilities.slice(0, 4);

    const toggleCapability = (capabilityId: string) => {
        setExpandedCapability(expandedCapability === capabilityId ? null : capabilityId);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                            NathIA - Suas Capacidades
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Inteligência artificial especializada em maternidade
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleCapabilities.map((capability) => {
                    const Icon = capability.icon;
                    const isExpanded = expandedCapability === capability.id;

                    return (
                        <motion.div
                            key={capability.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
                            onClick={() => toggleCapability(capability.id)}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 bg-gradient-to-r ${capability.color} rounded-lg flex items-center justify-center`}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
                                            {capability.title}
                                        </h4>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            {capability.description}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                    aria-label={isExpanded ? "Recolher" : "Expandir"}
                                >
                                    {isExpanded ? (
                                        <ChevronUp className="w-4 h-4 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-gray-500" />
                                    )}
                                </button>
                            </div>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600"
                                    >
                                        <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Exemplos de perguntas:
                                        </h5>
                                        <div className="space-y-1">
                                            {capability.examples.map((example, index) => (
                                                <div
                                                    key={index}
                                                    className="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-100 dark:border-gray-600"
                                                >
                                                    "{example}"
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {capabilities.length > 4 && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="flex items-center gap-2 mx-auto px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 text-sm font-medium"
                    >
                        <Zap className="w-4 h-4" />
                        {showAll ? 'Ver Menos' : `Ver Mais ${capabilities.length - 4} Capacidades`}
                    </button>
                </div>
            )}

            {/* AI Status */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
                            NathIA Ativa
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Múltiplas APIs de IA integradas para respostas mais precisas
                        </p>
                    </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                    {['OpenAI GPT-4', 'Claude 3', 'Gemini Pro', 'Perplexity'].map((provider) => (
                        <span
                            key={provider}
                            className="px-2 py-1 bg-white dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400 rounded-full border border-gray-200 dark:border-gray-600"
                        >
                            {provider}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};