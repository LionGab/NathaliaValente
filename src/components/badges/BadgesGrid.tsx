// =====================================================
// CLUBNATH BADGES GRID
// Grid de Badges com Categorias
// =====================================================

import React, { useState, useEffect } from 'react';
import { Trophy, Filter, Search, Star, Crown, Sparkles, TrendingUp, Users } from 'lucide-react';
import { badgesService, Badge, BadgeProgress, BadgeStats } from '../../services/badges.service';
import { useAuth } from '../../contexts/AuthContext';
import { BadgeCard } from './BadgeCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface BadgesGridProps {
  showStats?: boolean;
  showFilters?: boolean;
  maxBadges?: number;
}

const categoryFilters = [
  { id: 'all', label: 'Todas', icon: '🏆' },
  { id: 'participation', label: 'Participação', icon: '👥' },
  { id: 'faith', label: 'Fé', icon: '🙏' },
  { id: 'support', label: 'Apoio', icon: '🤗' },
  { id: 'journey', label: 'Jornada', icon: '🛤️' },
  { id: 'special', label: 'Especial', icon: '⭐' },
];

const rarityFilters = [
  { id: 'all', label: 'Todas', color: 'text-gray-600' },
  { id: 'common', label: 'Comum', color: 'text-gray-600' },
  { id: 'rare', label: 'Rara', color: 'text-blue-600' },
  { id: 'epic', label: 'Épica', color: 'text-purple-600' },
  { id: 'legendary', label: 'Lendária', color: 'text-yellow-600' },
];

export const BadgesGrid: React.FC<BadgesGridProps> = ({
  showStats = true,
  showFilters = true,
  maxBadges,
}) => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [badgeProgress, setBadgeProgress] = useState<BadgeProgress[]>([]);
  const [badgeStats, setBadgeStats] = useState<BadgeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBadges();
  }, [user]);

  const loadBadges = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [badgesData, progressData, statsData] = await Promise.all([
        badgesService.getAllBadges(),
        badgesService.getUserBadgeProgress(user.id),
        badgesService.getBadgeStats(user.id),
      ]);

      setBadges(badgesData);
      setBadgeProgress(progressData);
      setBadgeStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBadges = badges.filter((badge) => {
    const matchesCategory = selectedCategory === 'all' || badge.category === selectedCategory;
    const matchesRarity = selectedRarity === 'all' || badge.rarity === selectedRarity;
    const matchesSearch =
      searchTerm === '' ||
      badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesRarity && matchesSearch;
  });

  const displayedBadges = maxBadges ? filteredBadges.slice(0, maxBadges) : filteredBadges;

  const getProgressForBadge = (badgeId: string): BadgeProgress | undefined => {
    return badgeProgress.find((p) => p.badge_id === badgeId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      {showStats && badgeStats && (
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-200 dark:bg-pink-800 rounded-lg">
              <Trophy className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Suas Conquistas</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {badgeStats.earned_badges}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                de {badgeStats.total_badges} badges
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{badgeStats.rare_badges}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
                <Star className="w-3 h-3" />
                Raras
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{badgeStats.epic_badges}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
                <Trophy className="w-3 h-3" />
                Épicas
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {badgeStats.legendary_badges}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
                <Crown className="w-3 h-3" />
                Lendárias
              </div>
            </div>
          </div>

          {/* Recent Badges */}
          {badgeStats.recent_earned.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Conquistas Recentes
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {badgeStats.recent_earned.map((badge) => (
                  <div key={badge.id} className="flex-shrink-0">
                    <BadgeCard badge={badge} size="sm" showProgress={false} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters Section */}
      {showFilters && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar badges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categoryFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedCategory(filter.id)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-xl font-medium text-sm transition-all
                  ${
                    selectedCategory === filter.id
                      ? 'bg-pink-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                <span className="mr-2">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>

          {/* Rarity Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {rarityFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedRarity(filter.id)}
                className={`
                  flex-shrink-0 px-3 py-1 rounded-lg text-sm font-medium transition-all
                  ${
                    selectedRarity === filter.id
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {displayedBadges.map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            progress={getProgressForBadge(badge.id)}
            showProgress={true}
            size="md"
          />
        ))}
      </div>

      {/* Empty State */}
      {displayedBadges.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Nenhuma badge encontrada
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Tente ajustar os filtros ou termo de busca
          </p>
        </div>
      )}

      {/* Next Achievable Badges */}
      {badgeStats?.next_achievable && badgeStats.next_achievable.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-200 dark:bg-blue-800 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              Próximas Conquistas
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badgeStats.next_achievable.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                progress={getProgressForBadge(badge.id)}
                showProgress={true}
                size="sm"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
