/**
 * ForumTopicCard Component
 * Displays a forum topic card
 */

import { MessageCircle, Eye, Heart, Pin } from 'lucide-react';
import type { WellnessForumTopic } from '../../../types/postpartum-wellness';

interface ForumTopicCardProps {
  topic: WellnessForumTopic;
  onPress?: () => void;
}

export function ForumTopicCard({ topic, onPress }: ForumTopicCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      general: 'bg-gray-100 text-gray-700',
      recovery: 'bg-teal-100 text-teal-700',
      breastfeeding: 'bg-blue-100 text-blue-700',
      mental_health: 'bg-purple-100 text-purple-700',
      relationships: 'bg-pink-100 text-pink-700',
      baby_development: 'bg-green-100 text-green-700',
      tips_tricks: 'bg-amber-100 text-amber-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const categoryLabels: Record<string, string> = {
    general: 'Geral',
    recovery: 'Recuperação',
    breastfeeding: 'Amamentação',
    mental_health: 'Saúde Mental',
    relationships: 'Relacionamentos',
    baby_development: 'Desenvolvimento',
    tips_tricks: 'Dicas',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m atrás`;
    } else if (diffHours < 24) {
      return `${diffHours}h atrás`;
    } else if (diffDays < 7) {
      return `${diffDays}d atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  return (
    <div
      onClick={onPress}
      className="group bg-white dark:bg-neutral-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-neutral-200 dark:border-neutral-700 p-5"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {topic.profiles?.avatar_url ? (
            <img
              src={topic.profiles.avatar_url}
              alt={topic.profiles.full_name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
              {topic.profiles?.full_name?.charAt(0) || '?'}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
              {topic.profiles?.full_name || 'Anônimo'}
            </span>
            <span className="text-xs text-neutral-500">•</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {formatDate(topic.created_at)}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(topic.category)}`}
            >
              {categoryLabels[topic.category]}
            </span>
            {topic.is_pinned && (
              <span className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400">
                <Pin size={12} />
                Fixado
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {topic.title}
      </h3>

      {/* Content preview */}
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
        {topic.content}
      </p>

      {/* Tags */}
      {topic.tags && topic.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {topic.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 rounded-full text-xs bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400"
            >
              #{tag}
            </span>
          ))}
          {topic.tags.length > 3 && (
            <span className="px-2 py-0.5 text-xs text-neutral-500">+{topic.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
        <span className="flex items-center gap-1">
          <MessageCircle size={14} />
          {topic.replies_count} respostas
        </span>
        <span className="flex items-center gap-1">
          <Eye size={14} />
          {topic.views_count} visualizações
        </span>
        <span className="flex items-center gap-1">
          <Heart size={14} />
          {topic.likes_count}
        </span>
      </div>

      {/* Last reply info */}
      {topic.last_reply_at && (
        <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Última resposta: {formatDate(topic.last_reply_at)}
          </span>
        </div>
      )}
    </div>
  );
}
