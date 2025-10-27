// =====================================================
// GROUPS SERVICE - FACADE/ADAPTER PATTERN
// =====================================================
// Exporta interface unificada compatível com código legado
// Delega para services especializados
// =====================================================

import { GroupsCoreService } from './groups-core.service';
import { GroupsMembersService } from './groups-members.service';
import type { GroupService } from '../../../types/groups';

/**
 * Service unificado de Grupos (Facade Pattern).
 *
 * Mantém compatibilidade com a interface antiga enquanto
 * delega para services especializados internamente.
 *
 * **MIGRAÇÃO GRADUAL:**
 * - Código novo deve usar services especializados diretamente
 * - Código legado continua usando este facade
 *
 * @example
 * ```typescript
 * // ✅ Código novo (recomendado):
 * import { GroupsCoreService } from '@/features/groups/services/groups-core.service';
 * const groups = await GroupsCoreService.getGroups();
 *
 * // ⚠️ Código legado (compatibilidade):
 * import { groupsService } from '@/features/groups/services';
 * const groups = await groupsService.getGroups();
 * ```
 */
export const groupsService: Partial<GroupService> = {
  // =====================================================
  // GRUPOS - Delega para GroupsCoreService
  // =====================================================

  getGroups: GroupsCoreService.getGroups.bind(GroupsCoreService),
  getGroup: GroupsCoreService.getGroup.bind(GroupsCoreService),
  createGroup: GroupsCoreService.createGroup.bind(GroupsCoreService),
  updateGroup: GroupsCoreService.updateGroup.bind(GroupsCoreService),
  deleteGroup: GroupsCoreService.deleteGroup.bind(GroupsCoreService),

  // =====================================================
  // MEMBROS - Delega para GroupsMembersService
  // =====================================================

  getGroupMembers: GroupsMembersService.getMembers.bind(GroupsMembersService),
  joinGroup: GroupsMembersService.joinGroup.bind(GroupsMembersService),
  leaveGroup: GroupsMembersService.leaveGroup.bind(GroupsMembersService),
  updateMemberRole: GroupsMembersService.updateMemberRole.bind(GroupsMembersService),
  removeMember: GroupsMembersService.removeMember.bind(GroupsMembersService),

  // =====================================================
  // POSTS - TODO: Implementar GroupsPostsService
  // =====================================================

  // getGroupPosts: GroupsPostsService.getPosts.bind(GroupsPostsService),
  // createGroupPost: GroupsPostsService.createPost.bind(GroupsPostsService),
  // updateGroupPost: GroupsPostsService.updatePost.bind(GroupsPostsService),
  // deleteGroupPost: GroupsPostsService.deletePost.bind(GroupsPostsService),
  // pinGroupPost: GroupsPostsService.pinPost.bind(GroupsPostsService),
  // reactToPost: GroupsPostsService.reactToPost.bind(GroupsPostsService),
  // removeReaction: GroupsPostsService.removeReaction.bind(GroupsPostsService),

  // =====================================================
  // INVITES - TODO: Implementar GroupsInvitesService
  // =====================================================

  // getGroupInvites: GroupsInvitesService.getInvites.bind(GroupsInvitesService),
  // createGroupInvite: GroupsInvitesService.createInvite.bind(GroupsInvitesService),
  // respondToInvite: GroupsInvitesService.respondToInvite.bind(GroupsInvitesService),

  // =====================================================
  // NOTIFICAÇÕES - TODO: Implementar GroupsNotificationsService
  // =====================================================

  // getGroupNotifications: GroupsNotificationsService.getNotifications.bind(GroupsNotificationsService),
  // markNotificationAsRead: GroupsNotificationsService.markAsRead.bind(GroupsNotificationsService),
  // markAllNotificationsAsRead: GroupsNotificationsService.markAllAsRead.bind(GroupsNotificationsService),
};

// Exportar services especializados para código novo
export { GroupsCoreService } from './groups-core.service';
export { GroupsMembersService } from './groups-members.service';
