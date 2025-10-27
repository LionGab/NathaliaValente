import React from 'react';
import { Card } from '../Card';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <Card className="p-4 animate-pulse">
      <div className="space-y-3">
        {/* Imagem */}
        <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        
        {/* Título */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        
        {/* Preço */}
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        
        {/* Botão */}
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </div>
    </Card>
  );
};
