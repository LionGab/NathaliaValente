import React from 'react';
import { Camera, Shirt, Star, ShoppingBag, Heart, Sparkles, Crown, Zap } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const VirtualTryOnPage: React.FC = () => {
    const handleShopNAVA = (category: string) => {
        // Direcionar para a loja NAVA
        const navaShopUrl = `https://www.navabeachwear.com.br/${category}`;
        window.open(navaShopUrl, '_blank');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                <div className="px-4 py-6">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Camera className="w-8 h-8" />
                            <h1 className="text-3xl font-bold">
                                Provador Virtual
                            </h1>
                        </div>
                        <p className="text-pink-100 text-lg">
                            Experimente produtos NAVA com tecnologia avançada
                        </p>
                    </div>
                </div>
            </div>

            {/* NAVA Banner */}
            <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
                <div className="px-4 py-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-pink-200 dark:border-pink-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                                        <Crown className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                            NAVA Beachwear
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                                            Moda praia premium com tecnologia de ponta
                                        </p>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="flex items-center gap-1 text-pink-600 dark:text-pink-400">
                                                <Sparkles className="w-4 h-4" />
                                                Design exclusivo
                                            </span>
                                            <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                                                <Zap className="w-4 h-4" />
                                                Tecnologia UV
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => handleShopNAVA('bikinis')}
                                        className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-3"
                                    >
                                        <Shirt className="w-5 h-5 mr-2" />
                                        Biquínis
                                    </Button>
                                    <Button
                                        onClick={() => handleShopNAVA('activewear')}
                                        variant="outline"
                                        className="border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-6 py-3"
                                    >
                                        <Heart className="w-5 h-5 mr-2" />
                                        Activewear
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="px-4 py-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                        Coleção NAVA
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Biquíni Premium */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                            <div className="w-full h-48 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg mb-4 flex items-center justify-center">
                                <Shirt className="w-16 h-16 text-pink-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                Biquíni Premium
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Design exclusivo com tecnologia UV protection
                            </p>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-2xl font-bold text-pink-600">
                                    R$ 299,90
                                </span>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        4.8 (156)
                                    </span>
                                </div>
                            </div>
                            <Button
                                onClick={() => handleShopNAVA('bikinis')}
                                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                            >
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Comprar Agora
                            </Button>
                        </div>

                        {/* Legging Yoga */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                            <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg mb-4 flex items-center justify-center">
                                <Heart className="w-16 h-16 text-purple-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                Legging Yoga
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Alta performance para yoga e fitness
                            </p>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-2xl font-bold text-purple-600">
                                    R$ 199,90
                                </span>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        4.9 (89)
                                    </span>
                                </div>
                            </div>
                            <Button
                                onClick={() => handleShopNAVA('activewear')}
                                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                            >
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Comprar Agora
                            </Button>
                        </div>

                        {/* Coleção Completa */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                            <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-pink-100 dark:from-blue-900/20 dark:to-pink-900/20 rounded-lg mb-4 flex items-center justify-center">
                                <Crown className="w-16 h-16 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                Coleção Completa
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Explore toda a linha NAVA
                            </p>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-2xl font-bold text-blue-600">
                                    A partir de R$ 99,90
                                </span>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        4.9 (500+)
                                    </span>
                                </div>
                            </div>
                            <Button
                                onClick={() => handleShopNAVA('')}
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                            >
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Ver Coleção
                            </Button>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="w-12 h-12 mx-auto mb-4 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-pink-500" />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                Design Exclusivo
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Peças únicas criadas pela Nathália Valente
                            </p>
                        </div>

                        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                                <Zap className="w-6 h-6 text-purple-500" />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                Tecnologia UV
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Proteção solar de alta qualidade
                            </p>
                        </div>

                        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                <Heart className="w-6 h-6 text-blue-500" />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                Qualidade Premium
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Materiais de primeira qualidade
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};