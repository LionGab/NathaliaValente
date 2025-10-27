import React from 'react';
import { Check } from 'lucide-react';
import type { Routine } from '../types/routine';
import { getIconEmoji, getIconLabel } from '../types/routine';

interface RoutineCardProps {
  routine: Routine;
  onToggle: (id: string, completed: boolean) => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({ routine, onToggle }) => {
  const isCompleted = !!routine.completed_at;
  
  const colorMap = {
    feeding: 'from-pink-100 to-rose-100 dark:from-pink-950/30 dark:to-rose-950/30',
    bathing: 'from-blue-100 to-cyan-100 dark:from-blue-950/30 dark:to-cyan-950/30',
    sleeping: 'from-purple-100 to-indigo-100 dark:from-purple-950/30 dark:to-indigo-950/30',
    activities: 'from-yellow-100 to-amber-100 dark:from-yellow-950/30 dark:to-amber-950/30'
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorMap[routine.icon]} rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 ${
        isCompleted ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-4xl">{getIconEmoji(routine.icon)}</div>
        <button
          onClick={() => onToggle(routine.id, !isCompleted)}
          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
            isCompleted
              ? 'bg-green-500 border-green-500'
              : 'bg-white border-gray-300 hover:border-green-500'
          }`}
        >
          {isCompleted && <Check className="w-4 h-4 text-white" />}
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {routine.time}
        </div>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {routine.title}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {getIconLabel(routine.icon)}
        </div>
      </div>
    </div>
  );
};
