// =====================================================
// CLUBNATH PRAYER POST
// Componente para Posts de Oração
// =====================================================

import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  AlertTriangle,
  Clock,
  User,
  Eye,
  EyeOff,
} from 'lucide-react';
import { PrayerPost as PrayerPostType } from '../../services/prayers.service';
import { useAuth } from '../../contexts/AuthContext';
import { prayersService } from '../../services/prayers.service';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface PrayerPostProps {
  prayer: PrayerPostType;
  onAmenChange?: (prayerId: string, newCount: number) => void;
  onDelete?: (prayerId: string) => void;
  showActions?: boolean;
}

const categoryConfig = {
  gratitude: {
    label: 'Gratidão',
    icon: '🙏',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
  },
  request: {
    label: 'Pedido',
    icon: '💜',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
  },
  intercession: {
    label: 'Intercessão',
    icon: '🤲',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
  },
  praise: {
    label: 'Louvores',
    icon: '✨',
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
  },
};

export const PrayerPost: React.FC<PrayerPostProps> = ({
  prayer,
  onAmenChange,
  onDelete,
  showActions = true,
}) => {
  const { user } = useAuth();
  const [isAmening, setIsAmening] = useState(false);
  const [amenCount, setAmenCount] = useState(prayer.amen_count);
  const [userAmened, setUserAmened] = useState(prayer.user_amened || false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isOwner = user?.id === prayer.user_id;
  const category =
    categoryConfig[prayer.category as keyof typeof categoryConfig] || categoryConfig.request;
  const isLongContent = prayer.content.length > 200;
  const displayContent =
    showFullContent || !isLongContent ? prayer.content : prayer.content.substring(0, 200) + '...';

  const handleAmen = async () => {
    if (!user || isAmening) return;

    setIsAmening(true);

    try {
      if (userAmened) {
        const success = await prayersService.removeAmen(prayer.id!, user.id);
        if (success) {
          setUserAmened(false);
          setAmenCount((prev) => Math.max(0, prev - 1));
          onAmenChange?.(prayer.id!, amenCount - 1);
        }
      } else {
        const success = await prayersService.addAmen(prayer.id!, user.id);
        if (success) {
          setUserAmened(true);
          setAmenCount((prev) => prev + 1);
          onAmenChange?.(prayer.id!, amenCount + 1);
        }
      }
    } catch (error) {
      console.error('Erro ao alterar amen:', error);
    } finally {
      setIsAmening(false);
    }
  };

  const handleDelete = async () => {
    if (!isOwner || !onDelete) return;

    const confirmed = window.confirm('Tem certeza que deseja excluir esta oração?');
    if (confirmed) {
      onDelete(prayer.id!);
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {prayer.is_anonymous ? (
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            ) : (
              <Avatar type="oracao" size="sm" aria-label={prayer.user?.full_name || 'Usuário'} />
            )}

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {prayer.is_anonymous ? 'Mãe Anônima' : prayer.user?.full_name || 'Usuário'}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{formatTimeAgo(prayer.created_at!)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Categoria */}
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${category.bgColor} ${category.color}`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </div>

            {/* Urgente */}
            {prayer.is_urgent && (
              <div className="px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle className="w-3 h-3 text-red-600 dark:text-red-400" />
              </div>
            )}

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
                      onClick={handleDelete}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="mb-4">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
            {displayContent}
          </p>

          {isLongContent && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="mt-2 text-pink-600 dark:text-pink-400 text-sm font-medium hover:underline flex items-center gap-1"
            >
              {showFullContent ? (
                <>
                  <EyeOff className="w-3 h-3" />
                  Ver menos
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3" />
                  Ver mais
                </>
              )}
            </button>
          )}
        </div>

        {/* Ações */}
        {showActions && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleAmen}
              disabled={isAmening || !user}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                userAmened
                  ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-pink-50 dark:hover:bg-pink-900/20'
              }`}
            >
              {isAmening ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Heart className={`w-4 h-4 ${userAmened ? 'fill-current' : ''}`} />
              )}
              <span>Amém</span>
              {amenCount > 0 && <span className="text-sm">({amenCount})</span>}
            </button>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              {amenCount === 0 && 'Seja a primeira a dizer Amém'}
              {amenCount === 1 && '1 mãe está orando com você'}
              {amenCount > 1 && `${amenCount} mães estão orando com você`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
