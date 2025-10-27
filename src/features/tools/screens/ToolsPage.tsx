import React, { useState } from 'react';
import { BreastfeedingCalculator } from '../../../components/practical-tools/BreastfeedingCalculator';
import { SleepTracker } from '../../../components/practical-tools/SleepTracker';
import { MealPlanner } from '../../../components/practical-tools/MealPlanner';
import { MotherWellnessTracker } from '../../../components/practical-tools/MotherWellnessTracker';
import {
    Droplets,
    Moon,
    Utensils,
    Heart,
    Calculator,
    Calendar,
    Target,
    TrendingUp,
    Star,
    Users,
    Shield,
    Baby
} from 'lucide-react';

export const ToolsPage: React.FC = () => {
    const [activeTool, setActiveTool] = useState<string | null>(null);

    const tools = [
        {
            id: 'breastfeeding',
            title: 'Calculadora de Amamentação',
            description: 'Acompanhe mamadas, intervalos e recomendações',
            icon: Droplets,
            color: 'from-pink-500 to-rose-500',
            bgColor: 'bg-pink-50 dark:bg-pink-900/20',
            component: BreastfeedingCalculator
        },
        {
            id: 'sleep',
            title: 'Cronômetro de Sono',
            description: 'Monitore cochilos e sono noturno do bebê',
            icon: Moon,
            color: 'from-indigo-500 to-purple-500',
            bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
            component: SleepTracker
        },
        {
            id: 'meals',
            title: 'Planejador de Refeições',
            description: 'Organize refeições da semana e lista de compras',
            icon: Utensils,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            component: MealPlanner
        },
        {
            id: 'wellness',
            title: 'Bem-estar da Mãe',
            description: 'Acompanhe humor, energia e autocuidado',
            icon: Heart,
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            component: MotherWellnessTracker
        }
    ];

    const quickStats = [
        {
            title: 'Ferramentas Disponíveis',
            value: '4',
            icon: Calculator,
            color: 'text-blue-600 dark:text-blue-400'
        },
        {
            title: 'Mães Ajudadas',
            value: '2.5K+',
            icon: Users,
            color: 'text-green-600 dark:text-green-400'
        },
        {
            title: 'Tempo Economizado',
            value: '15min/dia',
            icon: TrendingUp,
            color: 'text-purple-600 dark:text-purple-400'
        },
        {
            title: 'Satisfação',
            value: '98%',
            icon: Star,
            color: 'text-yellow-600 dark:text-yellow-400'
        }
    ];

    const renderTool = () => {
        const tool = tools.find(t => t.id === activeTool);
        if (!tool) return null;

        const Component = tool.component;
        return <Component />;
    };

    if (activeTool) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="mb-6">
                    <button
                        onClick={() => setActiveTool(null)}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors mb-4"
                    >
                        ← Voltar para ferramentas
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {tools.find(t => t.id === activeTool)?.title}
                    </h1>
                </div>
                {renderTool()}
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                    Ferramentas Práticas para Mães
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Recursos reais para te ajudar no dia a dia da maternidade.
                    Organize, acompanhe e cuide de você e do seu bebê.
                </p>
            </div>

            {/* Estatísticas rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {quickStats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg text-center">
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${stat.color.replace('text-', 'bg-').replace('dark:text-', 'dark:bg-')} bg-opacity-10`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                            {stat.value}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            {stat.title}
                        </div>
                    </div>
                ))}
            </div>

            {/* Destaque especial */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 mb-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                        <Shield className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Desenvolvido por Mães, para Mães</h2>
                        <p className="text-pink-100">
                            Cada ferramenta foi pensada para resolver problemas reais da maternidade
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                        <Baby className="w-5 h-5" />
                        <span className="text-sm">Baseado em evidências científicas</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Target className="w-5 h-5" />
                        <span className="text-sm">Fácil de usar no dia a dia</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5" />
                        <span className="text-sm">Focado no bem-estar da família</span>
                    </div>
                </div>
            </div>

            {/* Grid de ferramentas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tools.map((tool) => (
                    <div
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id)}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`p-4 rounded-xl ${tool.bgColor}`}>
                                <tool.icon className={`w-8 h-8 bg-gradient-to-r ${tool.color} bg-clip-text text-transparent`} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                    {tool.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {tool.description}
                                </p>
                                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium">
                                    <span>Usar ferramenta</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Seção de benefícios */}
            <div className="mt-12 bg-gray-50 dark:bg-gray-700 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-8">
                    Por que usar nossas ferramentas?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                            Organização Diária
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Mantenha tudo organizado e nunca mais esqueça de nada importante
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                            Acompanhamento
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Monitore o desenvolvimento e bem-estar com dados precisos
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                            Bem-estar
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Cuide de você e do seu bebê com ferramentas especializadas
                        </p>
                    </div>
                </div>
            </div>

            {/* Call to action */}
            <div className="mt-8 text-center">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-white">
                    <h3 className="text-2xl font-bold mb-4">
                        Pronta para transformar sua rotina?
                    </h3>
                    <p className="text-lg mb-6 opacity-90">
                        Comece usando uma das ferramentas acima e veja como sua vida pode ficar mais organizada
                    </p>
                    <button className="bg-white text-pink-600 px-8 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition-all hover:scale-105">
                        Começar Agora
                    </button>
                </div>
            </div>
        </div>
    );
};
