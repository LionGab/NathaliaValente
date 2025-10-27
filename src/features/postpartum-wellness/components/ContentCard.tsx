/**
 * ContentCard Component
 * Displays a wellness content card with thumbnail, title, and metadata
 */

import { Heart, Bookmark, Clock, Eye } from 'lucide-react';
import type { WellnessContent } from '../../../types/postpartum-wellness';
import { LazyImage } from '../../../components/LazyImage';

interface ContentCardProps {
  content: WellnessContent;
  onPress?: () => void;
  onLike?: () => void;
  onSave?: () => void;
  isLiked?: boolean;
  isSaved?: boolean;
}

export function ContentCard({
  content,
  onPress,
  onLike,
  onSave,
  isLiked = false,
  isSaved = false,
}: ContentCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      nutrition: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      exercise: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      mental_health: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      baby_care: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
      self_care: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      recovery: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '🎥';
      case 'audio':
        return '🎧';
      case 'infographic':
        return '📊';
      default:
        return '📝';
    }
  };

  const categoryLabels: Record<string, string> = {
    nutrition: 'Nutrição',
    exercise: 'Exercícios',
    mental_health: 'Saúde Mental',
    baby_care: 'Cuidados com Bebê',
    self_care: 'Autocuidado',
    recovery: 'Recuperação',
  };

  return (
    <div
      onClick={onPress}
      className="group bg-white dark:bg-neutral-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer border border-neutral-200 dark:border-neutral-700"
    >
      {/* Thumbnail */}
      {content.thumbnail_url && (
        <div className="relative h-48 overflow-hidden">
          <LazyImage
            src={content.thumbnail_url}
            alt={content.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(content.category)}`}
            >
              {categoryLabels[content.category]}
            </span>
            {content.featured && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-500 text-white">
                ⭐ Destaque
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3 text-2xl">
            {getContentTypeIcon(content.content_type)}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {content.title}
        </h3>

        {/* Description */}
        {content.description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
            {content.description}
          </p>
        )}

        {/* Author */}
        {content.author_name && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Por {content.author_name}
            </span>
            {content.expert_verified && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                ✓ Verificado
              </span>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-3">
          <div className="flex items-center gap-3">
            {(content.reading_time_minutes || content.duration_minutes) && (
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {content.reading_time_minutes || content.duration_minutes} min
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {content.views_count}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-700">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike?.();
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
              isLiked
                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-600'
            }`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            <span className="text-xs font-medium">{content.likes_count}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave?.();
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
              isSaved
                ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-600'
            }`}
          >
            <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
            <span className="text-xs font-medium">Salvar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
