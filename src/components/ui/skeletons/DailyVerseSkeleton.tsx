import React from 'react';
import { Card } from '../Card';

export const DailyVerseSkeleton: React.FC = () => {
  return (
    <Card className="p-4 animate-pulse">
      <div className="flex items-start gap-3">
        {/* Ícone */}
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        
        {/* Conteúdo */}
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </Card>
  );
};
