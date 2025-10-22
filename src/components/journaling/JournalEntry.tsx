// =====================================================
// CLUBNATH JOURNAL ENTRY
// Componente para Entrada de Journal
// =====================================================

import React, { useState } from 'react';
import { 
  Heart, 
  Edit3, 
  Trash2, 
  MoreHorizontal, 
  Clock,
  BookOpen,
  Tag,
  Lock,
  Globe,
  Calendar
} from 'lucide-react';
import { JournalEntry as JournalEntryType } from '../../services/journaling.service';
import { useAuth } from '../../contexts/AuthContext';
import { journalingService } from '../../services/journaling.service';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface JournalEntryProps {
  entry: JournalEntryType;
  onEdit?: (entry: JournalEntryType) => void;
  onDelete?: (entryId: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

const moodConfig = {
  happy: {
    emoji: '😊',
    label: 'Feliz',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
  },
  neutral: {
    emoji: '😐',
    label: 'Neutro',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20'
  },
  sad: {
    emoji: '😢',
    label: 'Triste',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  },
  anxious: {
    emoji: '😰',
    label: 'Ansiosa',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20'
  },
  tired: {
    emoji: '😴',
    label: 'Cansada',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20'
  },
  grateful: {
    emoji: '🙏',
    label: 'Grata',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20'
  },
  overwhelmed: {
    emoji: '😵',
    label: 'Sobrecarregada',
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20'
  },
  peaceful: {
    emoji: '😌',
    label: 'Pacífica',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20'
  }
};

export const JournalEntry: React.FC<JournalEntryProps> = ({
  entry,
  onEdit,
  onDelete,
  showActions = true,
  compact = false
}) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isOwner = user?.id === entry.user_id;
  const mood = moodConfig[entry.mood as keyof typeof moodConfig] || moodConfig.neutral;
  const isLongContent = entry.content.length > 300;
  const displayContent = showFullContent || !isLongContent ? entry.content : entry.content.substring(0, 300) + '...';

  const handleDelete = async () => {
    if (!isOwner || !onDelete) return;
    
    const confirmed = window.confirm('Tem certeza que deseja excluir esta entrada de journal?');
    if (confirmed) {
      setIsDeleting(true);
      try {
        const success = await journalingService.deleteJournalEntry(entry.id!);
        if (success) {
          onDelete(entry.id!);
        }
      } catch (error) {
        console.error('Erro ao deletar entrada:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Agora mesmo';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
    
    return date.toLocaleDateString('pt-BR');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (compact) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${mood.bgColor}`}>
            <span className="text-lg">{mood.emoji}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-sm font-medium ${mood.color}`}>
                {mood.label}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatTimeAgo(entry.created_at!)}
              </span>
            </div>
            
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
              {entry.content}
            </p>
            
            {entry.prompt && (
              <div className="flex items-center gap-1 mt-2">
                <BookOpen className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {entry.prompt.title}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar
              type="pensativa"
              size="sm"
              aria-label={entry.user?.full_name || 'Usuário'}
            />
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {entry.user?.full_name || 'Usuário'}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(entry.created_at!)}</span>
                <Clock className="w-3 h-3 ml-2" />
                <span>{formatTimeAgo(entry.created_at!)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mood */}
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${mood.bgColor} ${mood.color}`}>
              <span className="mr-1">{mood.emoji}</span>
              {mood.label}
            </div>

            {/* Privacy */}
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
              {entry.is_private ? (
                <Lock className="w-3 h-3 text-gray-600 dark:text-gray-400" />
              ) : (
                <Globe className="w-3 h-3 text-gray-600 dark:text-gray-400" />
              )}
            </div>

            {/* Menu */}
            {isOwner && showActions && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onEdit?.(entry);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Edit3 className="w-3 h-3" />
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        handleDelete();
                      }}
                      disabled={isDeleting}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                    >
                      {isDeleting ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Prompt */}
        {entry.prompt && (
          <div className="mb-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl border border-pink-200 dark:border-pink-800">
            <div className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-pink-600 dark:text-pink-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-pink-900 dark:text-pink-100 text-sm">
                  {entry.prompt.title}
                </h4>
                <p className="text-xs text-pink-800 dark:text-pink-300 mt-1">
                  {entry.prompt.content}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo */}
        <div className="mb-4">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
            {displayContent}
          </p>
          
          {isLongContent && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="mt-2 text-pink-600 dark:text-pink-400 text-sm font-medium hover:underline"
            >
              {showFullContent ? 'Ver menos' : 'Ver mais'}
            </button>
          )}
        </div>

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>{entry.word_count} palavras</span>
            {entry.prompt && (
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                Prompt guiado
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {entry.is_private ? (
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Privado
              </span>
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                Público
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
