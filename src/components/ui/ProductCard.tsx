import React from 'react';
import { Star, ShoppingBag, Heart, Eye } from 'lucide-react';
import { Button } from './Button';
import { ImageWithFallback } from './ImageWithFallback';
import { NavaSpecificImage } from '../../services/nava-specific-images.service';

interface ProductCardProps {
    product: NavaSpecificImage;
    onBuy: () => void;
    onView?: () => void;
    onLike?: () => void;
    className?: string;
    showFeatures?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onBuy,
    onView,
    onLike,
    className = '',
    showFeatures = false
}) => {
    const handleViewDetails = () => {
        if (onView) {
            onView();
        } else {
            // Comportamento padrão: scroll para detalhes
            const element = document.getElementById(`product-${product.id}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 ${className}`}>
            {/* Imagem do Produto */}
            <div className="w-full h-64 rounded-lg mb-4 overflow-hidden relative group">
                <ImageWithFallback
                    src={product.src}
                    alt={product.alt}
                    fallbackSrc={product.fallbackSrc}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Overlay com ações */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                        {onView && (
                            <Button
                                onClick={handleViewDetails}
                                variant="outline"
                                size="sm"
                                className="bg-white/90 hover:bg-white text-gray-900"
                            >
                                <Eye className="w-4 h-4 mr-1" />
                                Ver
                            </Button>
                        )}
                        {onLike && (
                            <Button
                                onClick={onLike}
                                variant="outline"
                                size="sm"
                                className="bg-white/90 hover:bg-white text-gray-900"
                            >
                                <Heart className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Informações do Produto */}
            <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {product.name}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {product.description}
                </p>

                {/* Modelo */}
                <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                    {product.model}
                </p>

                {/* Features (se habilitado) */}
                {showFeatures && product.features && (
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            Características:
                        </p>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                            {product.features.slice(0, 3).map((feature, index) => (
                                <li key={index} className="flex items-center">
                                    <span className="w-1 h-1 bg-pink-500 rounded-full mr-2"></span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Preço e Avaliação */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-bold text-pink-600">
                            {product.price}
                        </span>
                        {product.paymentInfo && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {product.paymentInfo}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            4.9 (156)
                        </span>
                    </div>
                </div>

                {/* Botão de Compra */}
                <Button
                    onClick={onBuy}
                    className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Comprar Agora
                </Button>
            </div>
        </div>
    );
};
