import React, { useState } from 'react';
import { Heart, Star, Sparkles, Users, Shield, ArrowRight } from 'lucide-react';

export const DesignSystemDemo: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<'colors' | 'typography' | 'components'>('colors');

  const ColorPalette = () => (
    <div className="space-y-6">
            {/* Primary Colors */}
            <div>
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
                    Primary Colors
                </h3>
                <div className="flex flex-wrap gap-2">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
                        <div key={shade} className="flex flex-col items-center">
                            <div
                                className={`w-12 h-12 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-primary-${shade}`}
                            />
                            <span className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                                {shade}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Secondary Colors */}
            <div>
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
                    Secondary Colors
                </h3>
                <div className="flex flex-wrap gap-2">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
                        <div key={shade} className="flex flex-col items-center">
                            <div
                                className={`w-12 h-12 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-secondary-${shade}`}
                            />
                            <span className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                                {shade}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Special Colors */}
            <div>
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
                    Special Colors
                </h3>
                <div className="flex flex-wrap gap-2">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
                        <div key={shade} className="flex flex-col items-center">
                            <div
                                className={`w-12 h-12 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-spiritual-${shade}`}
                            />
                            <span className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                                {shade}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const TypographyDemo = () => (
        <div className="space-y-6">
            {/* Display Styles */}
            <div>
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
                    Display Styles
                </h3>
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                        Display 2XL
                    </h1>
                    <h2 className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                        Display XL
                    </h2>
                    <h3 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        Display Large
                    </h3>
                </div>
            </div>

            {/* Heading Styles */}
            <div>
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
                    Heading Styles
                </h3>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                        Heading 1
                    </h1>
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                        Heading 2
                    </h2>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                        Heading 3
                    </h3>
                </div>
            </div>

            {/* Body Styles */}
            <div>
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
                    Body Styles
                </h3>
                <div className="space-y-2">
                    <p className="text-lg text-neutral-700 dark:text-neutral-300">
                        Large body text for important content
                    </p>
                    <p className="text-base text-neutral-700 dark:text-neutral-300">
                        Regular body text for standard content
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Small body text for secondary content
                    </p>
                </div>
            </div>
        </div>
    );

    const ComponentsDemo = () => (
        <div className="space-y-6">
            {/* Buttons */}
            <div>
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
                    Buttons
                </h3>
                <div className="space-y-3">
                    <button className="bg-primary-500 px-6 py-3 rounded-xl shadow-medium text-white font-semibold hover:bg-primary-600 transition-colors">
                        Primary Button
                    </button>

                    <button className="bg-secondary-500 px-6 py-3 rounded-xl shadow-medium text-white font-semibold hover:bg-secondary-600 transition-colors">
                        Secondary Button
                    </button>

                    <button className="border-2 border-primary-500 px-6 py-3 rounded-xl text-primary-500 font-semibold hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors">
                        Outline Button
                    </button>
                </div>
            </div>

            {/* Cards */}
            <div>
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
                    Cards
                </h3>
                <div className="space-y-3">
                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-700">
                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                            Card Title
                        </h4>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            This is a sample card with soft shadow and rounded corners.
                        </p>
                    </div>

                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 rounded-xl shadow-medium">
                        <h4 className="font-semibold text-white mb-2">
                            Gradient Card
                        </h4>
                        <p className="text-white/90">
                            This card uses a gradient background with medium shadow.
                        </p>
                    </div>
                </div>
            </div>

            {/* Icons */}
            <div>
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
                    Icons
                </h3>
                <div className="flex flex-wrap gap-4">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                            <Heart className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                            Heart
                        </span>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900 rounded-full flex items-center justify-center">
                            <Star className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
                        </div>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                            Star
                        </span>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900 rounded-full flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                        </div>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                            Sparkles
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex-1 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-neutral-900 dark:via-primary-950 dark:to-secondary-950">
            {/* Header */}
            <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-700 p-4">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 text-center">
                    ClubNath Design System
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center mt-1">
                    Acolhimento, Conexão e Pertencentimento
                </p>
            </div>

            {/* Tabs */}
            <div className="flex bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-700">
                {[
                    { key: 'colors', label: 'Cores' },
                    { key: 'typography', label: 'Tipografia' },
                    { key: 'components', label: 'Componentes' },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setSelectedTab(tab.key as any)}
                        className={`flex-1 py-3 px-4 ${selectedTab === tab.key
                                ? 'border-b-2 border-primary-500'
                                : 'border-b-2 border-transparent'
                            }`}
                    >
                        <span
                            className={`text-center font-medium ${selectedTab === tab.key
                                    ? 'text-primary-600 dark:text-primary-400'
                                    : 'text-neutral-600 dark:text-neutral-400'
                                }`}
                        >
                            {tab.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-y-auto">
                {selectedTab === 'colors' && <ColorPalette />}
                {selectedTab === 'typography' && <TypographyDemo />}
                {selectedTab === 'components' && <ComponentsDemo />}
            </div>
        </div>
    );
};
