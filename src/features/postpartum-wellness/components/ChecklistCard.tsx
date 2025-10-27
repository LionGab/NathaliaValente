/**
 * ChecklistCard Component
 * Displays a wellness checklist with interactive items
 */

import { CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';
import type { WellnessChecklist, ChecklistItem } from '../../../types/postpartum-wellness';

interface ChecklistCardProps {
  checklist: WellnessChecklist;
  completedItems?: Set<string>;
  onToggleItem?: (itemId: string, completed: boolean) => void;
  onPress?: () => void;
}

export function ChecklistCard({
  checklist,
  completedItems = new Set(),
  onToggleItem,
  onPress,
}: ChecklistCardProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const completedCount = checklist.items.filter((item) => completedItems.has(item.id)).length;
  const totalCount = checklist.items.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      hospital_bag: 'bg-purple-100 text-purple-700',
      baby_essentials: 'bg-pink-100 text-pink-700',
      recovery: 'bg-teal-100 text-teal-700',
      postpartum_checkup: 'bg-blue-100 text-blue-700',
      self_care: 'bg-amber-100 text-amber-700',
      feeding: 'bg-green-100 text-green-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const categoryLabels: Record<string, string> = {
    hospital_bag: 'Bolsa Maternidade',
    baby_essentials: 'Essenciais do Bebê',
    recovery: 'Recuperação',
    postpartum_checkup: 'Consultas',
    self_care: 'Autocuidado',
    feeding: 'Alimentação',
  };

  const toggleItem = (item: ChecklistItem) => {
    const isCompleted = completedItems.has(item.id);
    onToggleItem?.(item.id, !isCompleted);
  };

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-5">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${getCategoryColor(checklist.category)}`}
            >
              {categoryLabels[checklist.category]}
            </span>
            <h3
              onClick={onPress}
              className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {checklist.title}
            </h3>
          </div>
        </div>

        {checklist.description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
            {checklist.description}
          </p>
        )}

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Progresso</span>
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              {completedCount}/{totalCount}
            </span>
          </div>
          <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {checklist.items.map((item) => {
          const isCompleted = completedItems.has(item.id);
          const isExpanded = expandedItems.has(item.id);
          const hasNotes = item.notes && item.notes.trim().length > 0;

          return (
            <div
              key={item.id}
              className={`p-3 rounded-lg transition-colors ${
                isCompleted
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-neutral-50 dark:bg-neutral-700/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleItem(item)}
                  className="flex-shrink-0 mt-0.5 transition-transform hover:scale-110"
                >
                  {isCompleted ? (
                    <CheckCircle2 size={20} className="text-green-600 dark:text-green-400" />
                  ) : (
                    <Circle size={20} className="text-neutral-400 dark:text-neutral-500" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div
                    onClick={() => hasNotes && toggleExpanded(item.id)}
                    className={`cursor-pointer ${hasNotes ? 'hover:text-primary-600' : ''}`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        isCompleted
                          ? 'line-through text-neutral-500 dark:text-neutral-400'
                          : 'text-neutral-900 dark:text-neutral-100'
                      }`}
                    >
                      {item.text}
                      {item.optional && (
                        <span className="ml-2 text-xs text-neutral-500">(Opcional)</span>
                      )}
                    </p>
                    {item.category && (
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {item.category}
                      </span>
                    )}
                  </div>

                  {hasNotes && isExpanded && (
                    <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 italic">
                      {item.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      {checklist.tips && checklist.tips.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Dicas</h4>
          <ul className="space-y-1">
            {checklist.tips.map((tip, index) => (
              <li key={index} className="text-xs text-blue-700 dark:text-blue-300">
                • {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
