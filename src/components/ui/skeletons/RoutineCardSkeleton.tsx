import React from 'react';
import { Card } from '../Card';

export const RoutineCardSkeleton: React.FC = () => {
  return (
    <Card className="p-4 animate-pulse">
      <div className="flex items-center gap-3">
        {/* Ícone */}
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>

        {/* Conteúdo */}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </div>

        {/* Checkbox */}
        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </Card>
  );
};
