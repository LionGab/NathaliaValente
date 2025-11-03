// =====================================================
// CLUBNATH GRUPOS TEMÁTICOS - TIPOS TYPESCRIPT
// Santuário Digital de Empatia e Pertencimento
// =====================================================

export type GroupCategory =
  | 'Fé'
  | 'Amamentação'
  | 'Pós-Parto'
  | 'Mães Solo'
  | 'Criação'
  | 'Bem-estar'
  | 'Educação'
  | 'Relacionamentos'
  | 'Carreira'
  | 'Outros';

export type GroupRole = 'admin' | 'moderator' | 'member';

export type ReactionType = 'like' | 'love' | 'support' | 'pray' | 'hug' | 'celebrate';

export type NotificationType =
  | 'new_post'
  | 'new_member'
  | 'group_invite'
  | 'post_mentioned'
  | 'post_reaction'
  | 'group_updated'
  | 'moderation_action';

export type InviteStatus = 'pending' | 'accepted' | 'declined' | 'expired';

export type MediaType = 'image' | 'video' | 'audio';

// =====================================================
// INTERFACES PRINCIPAIS
// =====================================================

export interface Group {
  id: string;
  name: string;
  description: string;
  category: GroupCategory;
  creator_id: string;
  is_private: boolean;
  max_members: number;
  current_members: number;
  cover_image_url?: string;
  rules?: string;
  created_at: string;
  updated_at: string;

  // Relacionamentos
  creator?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  user_role?: GroupRole;
  user_joined_at?: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: GroupRole;
  joined_at: string;
  last_seen_at: string;
  is_muted: boolean;
  is_banned: boolean;

  // Relacionamentos
  user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
    bio?: string;
  };
  group?: Group;
}

export interface GroupPost {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  media_url?: string;
  media_type?: MediaType;
  parent_post_id?: string;
  is_pinned: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;

  // Relacionamentos
  user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  group?: Group;
  parent_post?: GroupPost;
  replies?: GroupPost[];
  reactions?: GroupPostReaction[];
  reactions_count?: {
    [key in ReactionType]: number;
  };
  user_reaction?: ReactionType;
}

export interface GroupPostReaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: ReactionType;
  created_at: string;

  // Relacionamentos
  user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface GroupInvite {
  id: string;
  group_id: string;
  invited_user_id: string;
  invited_by_user_id: string;
  message?: string;
  status: InviteStatus;
  expires_at: string;
  created_at: string;

  // Relacionamentos
  group?: Group;
  invited_user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  invited_by_user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface GroupNotification {
  id: string;
  user_id: string;
  group_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;

  // Relacionamentos
  group?: Group;
}

// =====================================================
// INTERFACES PARA FORMULÁRIOS
// =====================================================

export interface CreateGroupData {
  name: string;
  description: string;
  category: GroupCategory;
  is_private: boolean;
  max_members?: number;
  cover_image_url?: string;
  rules?: string;
}

export interface UpdateGroupData {
  name?: string;
  description?: string;
  category?: GroupCategory;
  is_private?: boolean;
  max_members?: number;
  cover_image_url?: string;
  rules?: string;
}

export interface CreateGroupPostData {
  content: string;
  media_url?: string;
  media_type?: MediaType;
  parent_post_id?: string;
}

export interface UpdateGroupPostData {
  content?: string;
  media_url?: string;
  media_type?: MediaType;
}

export interface CreateGroupInviteData {
  invited_user_id: string;
  message?: string;
}

// =====================================================
// INTERFACES PARA FILTROS E BUSCA
// =====================================================

export interface GroupFilters {
  category?: GroupCategory;
  is_private?: boolean;
  search?: string;
  user_role?: GroupRole;
  has_space?: boolean;
}

export interface GroupSearchParams {
  query?: string;
  category?: GroupCategory;
  is_private?: boolean;
  limit?: number;
  offset?: number;
  sort_by?: 'created_at' | 'current_members' | 'name';
  sort_order?: 'asc' | 'desc';
}

export interface GroupPostFilters {
  group_id: string;
  parent_post_id?: string | null; // null para posts principais
  is_pinned?: boolean;
  user_id?: string;
  limit?: number;
  offset?: number;
  sort_by?: 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
}

// =====================================================
// INTERFACES PARA ESTATÍSTICAS
// =====================================================

export interface GroupStats {
  total_groups: number;
  total_members: number;
  total_posts: number;
  active_groups: number;
  categories_distribution: Record<GroupCategory, number>;
  recent_activity: {
    new_groups: number;
    new_members: number;
    new_posts: number;
  };
}

export interface UserGroupStats {
  groups_created: number;
  groups_joined: number;
  total_posts: number;
  total_reactions_received: number;
  role_distribution: Record<GroupRole, number>;
}

// =====================================================
// INTERFACES PARA COMPONENTES
// =====================================================

export interface GroupCardProps {
  group: Group;
  onJoin?: (groupId: string) => void;
  onLeave?: (groupId: string) => void;
  onView?: (groupId: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

export interface GroupListProps {
  groups: Group[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  filters?: GroupFilters;
  onFiltersChange?: (filters: GroupFilters) => void;
}

export interface GroupDetailProps {
  groupId: string;
  onBack?: () => void;
  onEdit?: (groupId: string) => void;
  onInvite?: (groupId: string) => void;
}

export interface GroupPostProps {
  post: GroupPost;
  onReact?: (postId: string, reaction: ReactionType) => void;
  onReply?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onPin?: (postId: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

// =====================================================
// INTERFACES PARA HOOKS
// =====================================================

export interface UseGroupsOptions {
  filters?: GroupFilters;
  limit?: number;
  enabled?: boolean;
}

export interface UseGroupPostsOptions {
  groupId: string;
  filters?: GroupPostFilters;
  limit?: number;
  enabled?: boolean;
}

export interface UseGroupMembersOptions {
  groupId: string;
  role?: GroupRole;
  limit?: number;
  enabled?: boolean;
}

// =====================================================
// INTERFACES PARA SERVIÇOS
// =====================================================

export interface GroupService {
  // Grupos
  getGroups: (params?: GroupSearchParams) => Promise<Group[]>;
  getGroup: (id: string) => Promise<Group>;
  createGroup: (data: CreateGroupData) => Promise<Group>;
  updateGroup: (id: string, data: UpdateGroupData) => Promise<Group>;
  deleteGroup: (id: string) => Promise<void>;

  // Membros
  getGroupMembers: (groupId: string, options?: UseGroupMembersOptions) => Promise<GroupMember[]>;
  joinGroup: (groupId: string) => Promise<GroupMember>;
  leaveGroup: (groupId: string) => Promise<void>;
  updateMemberRole: (groupId: string, userId: string, role: GroupRole) => Promise<GroupMember>;
  removeMember: (groupId: string, userId: string) => Promise<void>;

  // Posts
  getGroupPosts: (groupId: string, options?: UseGroupPostsOptions) => Promise<GroupPost[]>;
  createGroupPost: (groupId: string, data: CreateGroupPostData) => Promise<GroupPost>;
  updateGroupPost: (postId: string, data: UpdateGroupPostData) => Promise<GroupPost>;
  deleteGroupPost: (postId: string) => Promise<void>;
  pinGroupPost: (postId: string) => Promise<GroupPost>;

  // Reações
  reactToPost: (postId: string, reaction: ReactionType) => Promise<GroupPostReaction>;
  removeReaction: (postId: string, reaction: ReactionType) => Promise<void>;

  // Convites
  getGroupInvites: (groupId?: string) => Promise<GroupInvite[]>;
  createGroupInvite: (groupId: string, data: CreateGroupInviteData) => Promise<GroupInvite>;
  respondToInvite: (inviteId: string, status: 'accepted' | 'declined') => Promise<GroupInvite>;

  // Notificações
  getGroupNotifications: (unreadOnly?: boolean) => Promise<GroupNotification[]>;
  markNotificationAsRead: (notificationId: string) => Promise<GroupNotification>;
  markAllNotificationsAsRead: () => Promise<void>;
}

// =====================================================
// CONSTANTES
// =====================================================

export const GROUP_CATEGORIES: GroupCategory[] = [
  'Fé',
  'Amamentação',
  'Pós-Parto',
  'Mães Solo',
  'Criação',
  'Bem-estar',
  'Educação',
  'Relacionamentos',
  'Carreira',
  'Outros',
];

export const GROUP_ROLES: GroupRole[] = ['admin', 'moderator', 'member'];

export const REACTION_TYPES: ReactionType[] = [
  'like',
  'love',
  'support',
  'pray',
  'hug',
  'celebrate',
];

export const REACTION_EMOJIS: Record<ReactionType, string> = {
  like: '👍',
  love: '❤️',
  support: '🤝',
  pray: '🙏',
  hug: '🤗',
  celebrate: '🎉',
};

export const REACTION_LABELS: Record<ReactionType, string> = {
  like: 'Curtir',
  love: 'Amar',
  support: 'Apoiar',
  pray: 'Orar',
  hug: 'Abraçar',
  celebrate: 'Celebrar',
};

export const MAX_GROUPS_PER_USER = 5;
export const MAX_GROUP_MEMBERS = 200;
export const MIN_GROUP_MEMBERS = 5;
export const DEFAULT_GROUP_MEMBERS = 50;

export const MAX_POST_CONTENT_LENGTH = 2000;
export const MIN_POST_CONTENT_LENGTH = 1;
export const MAX_GROUP_NAME_LENGTH = 100;
export const MIN_GROUP_NAME_LENGTH = 3;
export const MAX_GROUP_DESCRIPTION_LENGTH = 500;
export const MIN_GROUP_DESCRIPTION_LENGTH = 10;

// =====================================================
// UTILITÁRIOS
// =====================================================

export const getCategoryColor = (category: GroupCategory): string => {
  const colors: Record<GroupCategory, string> = {
    Fé: 'from-purple-500 to-indigo-600',
    Amamentação: 'from-pink-500 to-rose-600',
    'Pós-Parto': 'from-blue-500 to-cyan-600',
    'Mães Solo': 'from-orange-500 to-red-600',
    Criação: 'from-green-500 to-emerald-600',
    'Bem-estar': 'from-teal-500 to-blue-600',
    Educação: 'from-yellow-500 to-orange-600',
    Relacionamentos: 'from-red-500 to-pink-600',
    Carreira: 'from-gray-500 to-slate-600',
    Outros: 'from-indigo-500 to-purple-600',
  };
  return colors[category] || colors['Outros'];
};

export const getCategoryIcon = (category: GroupCategory): string => {
  const icons: Record<GroupCategory, string> = {
    Fé: '🙏',
    Amamentação: '🤱',
    'Pós-Parto': '👶',
    'Mães Solo': '💪',
    Criação: '🌱',
    'Bem-estar': '💚',
    Educação: '📚',
    Relacionamentos: '💕',
    Carreira: '💼',
    Outros: '🌟',
  };
  return icons[category] || icons['Outros'];
};

export const getRoleLabel = (role: GroupRole): string => {
  const labels: Record<GroupRole, string> = {
    admin: 'Administradora',
    moderator: 'Moderadora',
    member: 'Membro',
  };
  return labels[role];
};

export const getRoleColor = (role: GroupRole): string => {
  const colors: Record<GroupRole, string> = {
    admin: 'text-red-600 bg-red-100',
    moderator: 'text-blue-600 bg-blue-100',
    member: 'text-gray-600 bg-gray-100',
  };
  return colors[role];
};

export const canManageGroup = (userRole?: GroupRole): boolean => {
  return userRole === 'admin' || userRole === 'moderator';
};

export const canModerateGroup = (userRole?: GroupRole): boolean => {
  return userRole === 'admin';
};

export const isGroupFull = (group: Group): boolean => {
  return group.current_members >= group.max_members;
};

export const canJoinGroup = (group: Group, userRole?: GroupRole): boolean => {
  if (userRole) return false; // Já é membro
  if (isGroupFull(group)) return false; // Grupo cheio
  return true;
};

export const canLeaveGroup = (group: Group, userRole?: GroupRole): boolean => {
  if (!userRole) return false; // Não é membro
  if (userRole === 'admin' && group.creator_id) {
    // Admin pode sair se não for o criador
    return true;
  }
  return true;
};

export const formatGroupMemberCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

export const formatGroupAge = (createdAt: string): string => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Hoje';
  if (diffInDays === 1) return 'Ontem';
  if (diffInDays < 7) return `${diffInDays} dias`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} semanas`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} meses`;
  return `${Math.floor(diffInDays / 365)} anos`;
};
