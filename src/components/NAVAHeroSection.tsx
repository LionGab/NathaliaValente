/**
 * ClubNath VIP - NAVA Hero Section
 * Seção especial para destacar os produtos NAVA no início do feed
 */

import React from 'react';
import { ShoppingBag, Heart, ExternalLink } from 'lucide-react';

export const NAVAHeroSection: React.FC = () => {
  const handleProductClick = (productId: string) => {
    // Abrir link externo para a loja NAVA
    window.open('https://www.navabeachwear.com.br/', '_blank');
  };

  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-2xl p-6 mb-6 border border-pink-200/50 dark:border-pink-800/30">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
          <ShoppingBag className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Produtos em Destaque
          </h2>
          <p className="text-pink-600 dark:text-pink-400">
            Coleção exclusiva da Nathália
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Bikini Premium Nathália */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-32 h-48 sm:h-32 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src="https://i.imgur.com/L2xyl98.jpg"
                alt="Bikini Premium Nathália - Mãe e bebê"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, 128px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/128x128/FF69B4/FFFFFF?text=NAVA';
                }}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Bikini Premium Nathália
                </h3>
                <button className="text-pink-600 hover:text-pink-700 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                NAVA
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                Design exclusivo da Nathália Valente. Perfeito para mães especiais, com tecido de alta qualidade e proteção UV.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xl sm:text-2xl font-bold text-pink-600 dark:text-pink-400">
                  R$ 165,00
                </span>
                <button
                  onClick={() => handleProductClick('nava-bikini-premium')}
                  className="bg-pink-500 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-pink-600 transition-colors text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <ExternalLink className="w-4 h-4" />
                  Comprar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Conjunto Bikini Nathy */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-32 h-48 sm:h-32 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src="https://i.imgur.com/n2QJJ5y.jpg"
                alt="Conjunto Bikini Nathy - Praia"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, 128px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/128x128/FF69B4/FFFFFF?text=NAVA';
                }}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Conjunto Bikini Nathy
                </h3>
                <button className="text-pink-600 hover:text-pink-700 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                NAVA
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                Conjunto exclusivo da Nathália Valente. Design sofisticado e elegante, ideal para momentos especiais na praia.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                  R$ 165,00
                </span>
                <button
                  onClick={() => handleProductClick('nava-conjunto-bikini-nathy')}
                  className="bg-purple-500 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-purple-600 transition-colors text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <ExternalLink className="w-4 h-4" />
                  Comprar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-4 sm:mt-6 text-center">
        <button
          onClick={() => window.open('https://www.navabeachwear.com.br/', '_blank')}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mx-auto w-full sm:w-auto"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-sm sm:text-base">Ver Coleção Completa NAVA</span>
        </button>
      </div>
    </div>
  );
};
