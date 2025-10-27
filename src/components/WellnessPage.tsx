/**
 * WellnessPage Component
 * Main page for Postpartum Wellness features
 */

import { useState } from 'react';
import { Sparkles, BookOpen, Heart, Users, Calendar, CheckSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Wellness feature components
import { ContentCard } from '../features/postpartum-wellness/components/ContentCard';
import { RoutineCard } from '../features/postpartum-wellness/components/RoutineCard';
import { ChecklistCard } from '../features/postpartum-wellness/components/ChecklistCard';
import { ForumTopicCard } from '../features/postpartum-wellness/components/ForumTopicCard';

// Wellness hooks
import {
  useFeaturedContent,
  useRecordInteraction,
} from '../features/postpartum-wellness/hooks/useWellnessContent';
import { useFeaturedRoutines } from '../features/postpartum-wellness/hooks/useWellnessRoutines';
import {
  useWellnessChecklists,
  useUserChecklistItems,
  useUpdateChecklistItem,
} from '../features/postpartum-wellness/hooks/useWellnessChecklists';
import { useForumTopics } from '../features/postpartum-wellness/hooks/useWellnessForum';

type TabType = 'home' | 'content' | 'routines' | 'checklists' | 'forum' | 'calendar';

export function WellnessPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Fetch data
  const { data: featuredContent, isLoading: loadingContent } = useFeaturedContent(3);
  const { data: featuredRoutines, isLoading: loadingRoutines } = useFeaturedRoutines(3);
  const { data: checklists, isLoading: loadingChecklists } = useWellnessChecklists();
  const { data: userChecklistItems } = useUserChecklistItems(user?.id || '');
  const { data: forumTopicsData, isLoading: loadingForum } = useForumTopics({}, { per_page: 5 });

  // Mutations
  const recordInteraction = useRecordInteraction();
  const updateChecklistItem = useUpdateChecklistItem();

  // Create set of completed checklist items
  const completedItemsMap = new Map<string, Set<string>>();
  userChecklistItems?.forEach((item) => {
    if (!completedItemsMap.has(item.checklist_id)) {
      completedItemsMap.set(item.checklist_id, new Set());
    }
    if (item.completed) {
      completedItemsMap.get(item.checklist_id)?.add(item.item_id);
    }
  });

  const handleLikeContent = (contentId: string) => {
    if (!user?.id) return;
    // TODO: Check if already liked and toggle
    recordInteraction.mutate({
      userId: user.id,
      contentId,
      interactionType: 'like',
    });
  };

  const handleSaveContent = (contentId: string) => {
    if (!user?.id) return;
    // TODO: Check if already saved and toggle
    recordInteraction.mutate({
      userId: user.id,
      contentId,
      interactionType: 'save',
    });
  };

  const handleToggleChecklistItem = (checklistId: string, itemId: string, completed: boolean) => {
    if (!user?.id) return;
    updateChecklistItem.mutate({
      userId: user.id,
      checklistId,
      itemId,
      updates: { completed },
    });
  };

  const tabs = [
    { id: 'home' as TabType, label: 'Início', icon: Sparkles },
    { id: 'content' as TabType, label: 'Conteúdo', icon: BookOpen },
    { id: 'routines' as TabType, label: 'Rotinas', icon: Heart },
    { id: 'checklists' as TabType, label: 'Checklists', icon: CheckSquare },
    { id: 'forum' as TabType, label: 'Comunidade', icon: Users },
    { id: 'calendar' as TabType, label: 'Calendário', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 dark:from-neutral-900 dark:via-purple-950 dark:to-blue-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                Bem-Estar Pós-Parto
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Sua jornada de recuperação e autocuidado
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Welcome message */}
            <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl p-6 text-white">
              <h2 className="text-xl font-bold mb-2">Olá, Mamãe! 👋</h2>
              <p className="text-sm opacity-90">
                Bem-vinda ao seu espaço de bem-estar. Aqui você encontra conteúdo curado, rotinas
                personalizadas e uma comunidade de apoio.
              </p>
            </div>

            {/* Featured Content */}
            <section>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                📚 Conteúdo em Destaque
              </h2>
              {loadingContent ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredContent?.map((content) => (
                    <ContentCard
                      key={content.id}
                      content={content}
                      onLike={() => handleLikeContent(content.id)}
                      onSave={() => handleSaveContent(content.id)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Featured Routines */}
            <section>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                ✨ Rotinas Recomendadas
              </h2>
              {loadingRoutines ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredRoutines?.map((routine) => (
                    <RoutineCard
                      key={routine.id}
                      routine={routine}
                      onStart={() => console.log('Start routine:', routine.id)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Checklists */}
            <section>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                ✅ Suas Checklists
              </h2>
              {loadingChecklists ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {checklists?.slice(0, 2).map((checklist) => (
                    <ChecklistCard
                      key={checklist.id}
                      checklist={checklist}
                      completedItems={completedItemsMap.get(checklist.id)}
                      onToggleItem={(itemId, completed) =>
                        handleToggleChecklistItem(checklist.id, itemId, completed)
                      }
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Forum Topics */}
            <section>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                💬 Comunidade
              </h2>
              {loadingForum ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {forumTopicsData?.data.slice(0, 3).map((topic) => (
                    <ForumTopicCard key={topic.id} topic={topic} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab !== 'home' && (
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 text-center">
            <p className="text-neutral-600 dark:text-neutral-400">
              Conteúdo de {tabs.find((t) => t.id === activeTab)?.label} em desenvolvimento...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
