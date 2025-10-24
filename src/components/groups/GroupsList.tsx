// =====================================================
// CLUBNATH GRUPOS TEMÁTICOS - LISTA DE GRUPOS
// Santuário Digital de Empatia e Pertencimento
// =====================================================

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Filter,
  Plus,
  Users,
  Lock,
  Globe,
  Star,
  Heart,
  MessageCircle,
  Calendar,
  ChevronRight,
  X
} from 'lucide-react';
import { groupsService, searchGroups, getPopularGroups, getRecentGroups } from '../../services/groups.service';
import { Group, GroupCategory, GroupFilters } from '../../types/groups';
import { GroupCard } from './GroupCard';
import { CreateGroupModal } from './CreateGroupModal';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Button } from '../ui/Button';
import {
  GROUP_CATEGORIES,
  getCategoryColor,
  getCategoryIcon,
  formatGroupMemberCount,
  formatGroupAge
} from '../../types/groups';

interface GroupsListProps {
  onGroupSelect?: (group: Group) => void;
  showCreateButton?: boolean;
  initialFilters?: GroupFilters;
}

export const GroupsList: React.FC<GroupsListProps> = ({
  onGroupSelect,
  showCreateButton = true,
  initialFilters = {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GroupCategory | 'Todos'>('Todos');
  const [showPrivateOnly, setShowPrivateOnly] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'discover' | 'popular' | 'recent'>('discover');

  // Filtros aplicados
  const filters: GroupFilters = useMemo(() => ({
    ...initialFilters,
    category: selectedCategory === 'Todos' ? undefined : selectedCategory,
    is_private: showPrivateOnly ? true : undefined,
    search: searchQuery.trim() || undefined
  }), [selectedCategory, showPrivateOnly, searchQuery, initialFilters]);

  // Queries para diferentes tipos de grupos
  const {
    data: discoverGroups = [],
    isLoading: discoverLoading,
    refetch: refetchDiscover
  } = useQuery({
    queryKey: ['groups', 'discover', filters],
    queryFn: () => groupsService.getGroups({
      query: filters.search,
      category: filters.category,
      is_private: filters.is_private,
      limit: 20
    }),
    enabled: activeTab === 'discover'
  });

  const {
    data: popularGroups = [],
    isLoading: popularLoading
  } = useQuery({
    queryKey: ['groups', 'popular'],
    queryFn: getPopularGroups,
    enabled: activeTab === 'popular'
  });

  const {
    data: recentGroups = [],
    isLoading: recentLoading
  } = useQuery({
    queryKey: ['groups', 'recent'],
    queryFn: getRecentGroups,
    enabled: activeTab === 'recent'
  });

  // Dados ativos baseado na aba
  const activeGroups = useMemo(() => {
    switch (activeTab) {
      case 'popular': return popularGroups;
      case 'recent': return recentGroups;
      default: return discoverGroups;
    }
  }, [activeTab, discoverGroups, popularGroups, recentGroups]);

  const isLoading = useMemo(() => {
    switch (activeTab) {
      case 'popular': return popularLoading;
      case 'recent': return recentLoading;
      default: return discoverLoading;
    }
  }, [activeTab, discoverLoading, popularLoading, recentLoading]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab !== 'discover') {
      setActiveTab('discover');
    }
  };

  const handleCategoryFilter = (category: GroupCategory | 'Todos') => {
    setSelectedCategory(category);
    if (activeTab !== 'discover') {
      setActiveTab('discover');
    }
  };

  const handleCreateGroup = () => {
    setShowCreateModal(true);
  };

  const handleGroupCreated = () => {
    setShowCreateModal(false);
    refetchDiscover();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Todos');
    setShowPrivateOnly(false);
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'Todos' || showPrivateOnly;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Grupos Temáticos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Encontre sua tribo de mães e compartilhe sua jornada
            </p>
          </div>

          {showCreateButton && (
            <Button
              onClick={handleCreateGroup}
              leftIcon={<Plus className="w-5 h-5" />}
              size="lg"
            >
              Criar Grupo
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'discover', label: 'Descobrir', icon: Search },
            { id: 'popular', label: 'Populares', icon: Star },
            { id: 'recent', label: 'Recentes', icon: Calendar }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${activeTab === id
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Filtros - apenas na aba Descobrir */}
        {activeTab === 'discover' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            {/* Busca */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar grupos por nome ou descrição..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Filtros de Categoria */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Categorias:
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {['Todos', ...GROUP_CATEGORIES].map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryFilter(category as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full font-medium transition-all ${selectedCategory === category
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    {category !== 'Todos' && (
                      <span className="text-lg">{getCategoryIcon(category as GroupCategory)}</span>
                    )}
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtros Adicionais */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPrivateOnly}
                  onChange={(e) => setShowPrivateOnly(e.target.checked)}
                  className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Apenas grupos privados
                </span>
              </label>

              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  size="sm"
                  rightIcon={<X className="w-4 h-4" />}
                >
                  Limpar Filtros
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Lista de Grupos */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Carregando grupos..." />
          </div>
        ) : activeGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onSelect={(group) => onGroupSelect?.(group as Group)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
              <Users className="w-12 h-12 text-pink-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum grupo encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {activeTab === 'discover'
                ? 'Tente ajustar os filtros ou criar um novo grupo'
                : 'Ainda não há grupos nesta categoria'
              }
            </p>
            {activeTab === 'discover' && (
              <div className="flex gap-3 justify-center">
                <Button onClick={clearFilters} variant="outline">
                  Limpar Filtros
                </Button>
                {showCreateButton && (
                  <Button onClick={handleCreateGroup} leftIcon={<Plus className="w-4 h-4" />}>
                    Criar Grupo
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Criação */}
      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleGroupCreated}
        />
      )}
    </div>
  );
};

// =====================================================
// COMPONENTE GROUP CARD
// =====================================================