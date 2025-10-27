/**
 * RoutineCard Component
 * Displays a wellness routine card
 */

import { Clock, Star, TrendingUp } from 'lucide-react';
import type { WellnessRoutine } from '../../../types/postpartum-wellness';

interface RoutineCardProps {
  routine: WellnessRoutine;
  onStart?: () => void;
  onPress?: () => void;
}

export function RoutineCard({ routine, onStart, onPress }: RoutineCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      morning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      evening: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
      exercise: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      meditation: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      self_care: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
      baby_care: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getDifficultyBadge = (level?: string) => {
    if (!level) return null;
    const badges: Record<string, { label: string; className: string }> = {
      easy: { label: 'Fácil', className: 'bg-green-100 text-green-700' },
      moderate: { label: 'Moderado', className: 'bg-yellow-100 text-yellow-700' },
      challenging: { label: 'Desafiador', className: 'bg-red-100 text-red-700' },
    };
    return badges[level] || null;
  };

  const categoryLabels: Record<string, string> = {
    morning: 'Manhã',
    evening: 'Noite',
    exercise: 'Exercício',
    meditation: 'Meditação',
    self_care: 'Autocuidado',
    baby_care: 'Bebê',
  };

  const difficultyBadge = getDifficultyBadge(routine.difficulty_level);

  return (
    <div
      onClick={onPress}
      className="group bg-white dark:bg-neutral-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer border border-neutral-200 dark:border-neutral-700 p-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(routine.category)}`}
            >
              {categoryLabels[routine.category]}
            </span>
            {routine.featured && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-500 text-white">
                ⭐ Destaque
              </span>
            )}
            {difficultyBadge && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyBadge.className}`}
              >
                {difficultyBadge.label}
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {routine.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      {routine.description && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
          {routine.description}
        </p>
      )}

      {/* Metadata */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {routine.duration_minutes} min
          </span>
          {routine.rating_average && routine.rating_count > 0 && (
            <span className="flex items-center gap-1">
              <Star size={14} fill="currentColor" className="text-yellow-500" />
              {routine.rating_average.toFixed(1)} ({routine.rating_count})
            </span>
          )}
          <span className="flex items-center gap-1">
            <TrendingUp size={14} />
            {routine.completions_count} conclusões
          </span>
        </div>
      </div>

      {/* Steps count */}
      <div className="mb-4">
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {routine.steps?.length || 0} passos
        </span>
      </div>

      {/* Expert info */}
      {routine.expert_created && routine.expert_name && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            ✓ Criado por: {routine.expert_name}
            {routine.expert_credentials && ` - ${routine.expert_credentials}`}
          </p>
        </div>
      )}

      {/* Action */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onStart?.();
        }}
        className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        Iniciar Rotina
      </button>
    </div>
  );
}
