import React from 'react';
import { Camera, Shirt, Star, ShoppingBag, Heart, Sparkles, Crown, Zap } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { ImageWithFallback } from '../../../components/ui/ImageWithFallback';
import { ProductCard } from '../../../components/ui/ProductCard';
import { useNavaImages } from '../../../hooks/useNavaImages';

export const VirtualTryOnPage: React.FC = () => {
    const { bestSellers, heroImage, imagesLoaded, loading, error } = useNavaImages();

    const handleShopNAVA = (category: string) => {
        // Direcionar para a loja NAVA
        const navaShopUrl = `https://www.navabeachwear.com.br/${category}`;
        window.open(navaShopUrl, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Carregando produtos NAVA...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Erro ao carregar imagens</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>
                        Tentar Novamente
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Hero Section com Imagem */}
            <div className="relative bg-gradient-to-r from-pink-500 to-purple-600 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative px-4 py-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div className="text-center lg:text-left">
                                <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                                    <Camera className="w-8 h-8" />
                                    <h1 className="text-4xl font-bold">
                                        Provador Virtual
                                    </h1>
                                </div>
                                <p className="text-pink-100 text-xl mb-6">
                                    Experimente produtos NAVA com tecnologia avançada
                                </p>
                                <p className="text-pink-200 text-lg">
                                    O melhor para o seu bebê desde os primeiros dias de vida
                                </p>
                            </div>
                            <div className="flex justify-center lg:justify-end">
                                <div className="w-80 h-80 rounded-2xl overflow-hidden shadow-2xl">
                                    {heroImage ? (
                                        <ImageWithFallback
                                            src={heroImage.src}
                                            alt={heroImage.alt}
                                            fallbackSrc={heroImage.fallbackSrc}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                                            <Camera className="w-16 h-16 text-pink-500" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
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

            {/* Best Sellers Section */}
            <div className="px-4 py-8 bg-white dark:bg-gray-800">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        The Best Sellers
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {bestSellers.map((image, index) => (
                            <div key={image.id} className="relative group cursor-pointer">
                                <div className="aspect-square rounded-xl overflow-hidden shadow-lg">
                                    <ImageWithFallback
                                        src={image.src}
                                        alt={image.alt}
                                        fallbackSrc={image.fallbackSrc}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end">
                                    <p className="text-white p-3 font-semibold">{image.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="px-4 py-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                        Coleção NAVA
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {bestSellers.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onBuy={() => handleShopNAVA('bikinis')}
                                onView={() => {
                                    // Scroll para detalhes do produto
                                    const element = document.getElementById(`product-${product.id}`);
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                                onLike={() => {
                                    // Adicionar aos favoritos
                                    console.log('Produto adicionado aos favoritos:', product.name);
                                }}
                                showFeatures={true}
                            />
                        ))}
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