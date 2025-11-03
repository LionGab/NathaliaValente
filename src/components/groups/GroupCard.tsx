import { Users, Lock } from 'lucide-react';
import type { Group } from '../../types/groups';
import {
  getCategoryIcon,
  getCategoryColor,
  formatGroupMemberCount,
  isGroupFull,
} from '../../types/groups';

interface GroupCardProps {
  group: Group;
  onSelect?: (group: { id: string; name: string }) => void;
}

export function GroupCard({ group, onSelect }: GroupCardProps) {
  const memberCount = formatGroupMemberCount(group.current_members);
  const isFull = isGroupFull(group);

  return (
    <button
      onClick={() => onSelect?.({ id: group.id, name: group.name })}
      className="w-full text-left bg-white dark:bg-claude-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-claude-gray-100 dark:border-claude-gray-700"
    >
      {/* Header com categoria */}
      <div className="flex items-start justify-between mb-3">
        <div
          className={`px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(group.category)} text-white text-xs font-medium flex items-center gap-1`}
        >
          <span>{getCategoryIcon(group.category)}</span>
          <span>{group.category}</span>
        </div>
        {group.is_private && (
          <div className="flex items-center gap-1 text-claude-gray-500">
            <Lock className="w-3 h-3" />
            <span className="text-xs">Privado</span>
          </div>
        )}
      </div>

      {/* Nome e descrição */}
      <h3 className="font-semibold text-claude-gray-900 dark:text-white mb-2 line-clamp-1">
        {group.name}
      </h3>
      <p className="text-sm text-claude-gray-600 dark:text-claude-gray-300 mb-4 line-clamp-2">
        {group.description}
      </p>

      {/* Footer com membros */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-claude-gray-500 dark:text-claude-gray-400">
          <Users className="w-4 h-4" />
          <span className="text-sm">
            {memberCount} {isFull ? '(Cheio)' : 'membros'}
          </span>
        </div>

        {group.user_role && (
          <span className="text-xs px-2 py-1 rounded-full bg-claude-orange-100 dark:bg-claude-orange-900 text-claude-orange-700 dark:text-claude-orange-300">
            Membro
          </span>
        )}
      </div>
    </button>
  );
}
