// =====================================================
// CLUBNATH GRUPOS TEMÁTICOS - SERVIÇO MIGRADO
// =====================================================
// ATENÇÃO: Este arquivo está em processo de migração.
// Novos códigos devem usar services especializados em:
// src/features/groups/services/
// =====================================================

import { supabase } from '../lib/supabase';
import { GroupsCoreService } from '../features/groups/services/groups-core.service';
import { GroupsMembersService } from '../features/groups/services/groups-members.service';
import type {
  Group,
  GroupMember,
  GroupPost,
  GroupPostReaction,
  GroupInvite,
  GroupNotification,
  CreateGroupData,
  UpdateGroupData,
  CreateGroupPostData,
  UpdateGroupPostData,
  CreateGroupInviteData,
  GroupSearchParams,
  GroupPostFilters,
  UseGroupMembersOptions,
  GroupService
} from '../types/groups';

/**
 * Service de Grupos (VERSÃO EM MIGRAÇÃO).
 *
 * **IMPORTANTE:**
 * - Métodos marcados com ✅ foram migrados para nova arquitetura
 * - Métodos marcados com ⚠️ ainda usam código legado
 * - Para novos códigos, use services especializados diretamente
 *
 * @deprecated Use services especializados em src/features/groups/services/
 */
export const groupsService: GroupService = {
  // =====================================================
  // ✅ GRUPOS - MIGRADO PARA GroupsCoreService
  // =====================================================

  /**
   * @deprecated Use GroupsCoreService.getGroups()
   */
  getGroups: async (params) => {
    return GroupsCoreService.getGroups(params);
  },

  /**
   * @deprecated Use GroupsCoreService.getGroup()
   */
  getGroup: async (id) => {
    return GroupsCoreService.getGroup(id);
  },

  /**
   * @deprecated Use GroupsCoreService.createGroup()
   */
  createGroup: async (data) => {
    return GroupsCoreService.createGroup(data);
  },

  /**
   * @deprecated Use GroupsCoreService.updateGroup()
   */
  updateGroup: async (id, data) => {
    return GroupsCoreService.updateGroup(id, data);
  },

  /**
   * @deprecated Use GroupsCoreService.deleteGroup()
   */
  deleteGroup: async (id) => {
    return GroupsCoreService.deleteGroup(id);
  },

  // =====================================================
  // ✅ MEMBROS - MIGRADO PARA GroupsMembersService
  // =====================================================

  /**
   * @deprecated Use GroupsMembersService.getMembers()
   */
  getGroupMembers: async (groupId, options) => {
    return GroupsMembersService.getMembers(groupId, options);
  },

  /**
   * @deprecated Use GroupsMembersService.joinGroup()
   */
  joinGroup: async (groupId) => {
    return GroupsMembersService.joinGroup(groupId);
  },

  /**
   * @deprecated Use GroupsMembersService.leaveGroup()
   */
  leaveGroup: async (groupId) => {
    return GroupsMembersService.leaveGroup(groupId);
  },

  /**
   * @deprecated Use GroupsMembersService.updateMemberRole()
   */
  updateMemberRole: async (groupId, userId, role) => {
    return GroupsMembersService.updateMemberRole(groupId, userId, role);
  },

  /**
   * @deprecated Use GroupsMembersService.removeMember()
   */
  removeMember: async (groupId, userId) => {
    return GroupsMembersService.removeMember(groupId, userId);
  },

  // =====================================================
  // ⚠️ POSTS - AINDA NÃO MIGRADO (CÓDIGO LEGADO)
  // =====================================================

  getGroupPosts: async (groupId: string, options?: any): Promise<GroupPost[]> => {
    // TODO: Migrar para GroupsPostsService
    const { filters, limit = 20, offset = 0 } = options || {};

    let queryBuilder = supabase
      .from('group_posts')
      .select(`
        *,
        user:profiles!group_posts_user_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('group_id', groupId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Aplicar filtros
    if (filters?.pinned_only) {
      queryBuilder = queryBuilder.eq('is_pinned', true);
    }

    if (filters?.parent_post_id) {
      queryBuilder = queryBuilder.eq('parent_post_id', filters.parent_post_id);
    } else {
      queryBuilder = queryBuilder.is('parent_post_id', null);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error fetching group posts:', error);
      throw new Error('Erro ao buscar posts do grupo');
    }

    // Processar reações
    const postsWithReactions = await Promise.all(
      (data || []).map(async (post) => {
        const { data: reactions } = await supabase
          .from('group_post_reactions')
          .select('reaction_type')
          .eq('post_id', post.id);

        const reactionsCount = {
          like: 0,
          love: 0,
          support: 0,
          pray: 0,
          hug: 0,
          celebrate: 0
        };

        reactions?.forEach((r) => {
          if (r.reaction_type in reactionsCount) {
            reactionsCount[r.reaction_type as keyof typeof reactionsCount]++;
          }
        });

        // Verificar reação do usuário
        const { data: user } = await supabase.auth.getUser();
        let userReaction = undefined;

        if (user?.user) {
          const { data: userReactionData } = await supabase
            .from('group_post_reactions')
            .select('reaction_type')
            .eq('post_id', post.id)
            .eq('user_id', user.user.id)
            .single();

          userReaction = userReactionData?.reaction_type;
        }

        return {
          ...post,
          reactions_count: reactionsCount,
          user_reaction: userReaction
        };
      })
    );

    return postsWithReactions as GroupPost[];
  },

  createGroupPost: async (groupId: string, data: CreateGroupPostData): Promise<GroupPost> => {
    // TODO: Migrar para GroupsPostsService
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Usuário não autenticado');

    const { data: post, error } = await supabase
      .from('group_posts')
      .insert({
        group_id: groupId,
        user_id: user.user.id,
        content: data.content,
        media_url: data.media_url,
        media_type: data.media_type,
        parent_post_id: data.parent_post_id,
        is_approved: true
      })
      .select(`
        *,
        user:profiles!group_posts_user_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Error creating group post:', error);
      throw new Error('Erro ao criar post');
    }

    return post as GroupPost;
  },

  updateGroupPost: async (postId: string, data: UpdateGroupPostData): Promise<GroupPost> => {
    // TODO: Migrar para GroupsPostsService
    const { data: post, error } = await supabase
      .from('group_posts')
      .update({
        content: data.content,
        media_url: data.media_url,
        media_type: data.media_type,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .select(`
        *,
        user:profiles!group_posts_user_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Error updating group post:', error);
      throw new Error('Erro ao atualizar post');
    }

    return post as GroupPost;
  },

  deleteGroupPost: async (postId: string): Promise<void> => {
    // TODO: Migrar para GroupsPostsService
    const { error } = await supabase
      .from('group_posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('Error deleting group post:', error);
      throw new Error('Erro ao deletar post');
    }
  },

  pinGroupPost: async (postId: string): Promise<GroupPost> => {
    // TODO: Migrar para GroupsPostsService
    const { data: post, error } = await supabase
      .from('group_posts')
      .update({ is_pinned: true })
      .eq('id', postId)
      .select(`
        *,
        user:profiles!group_posts_user_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Error pinning group post:', error);
      throw new Error('Erro ao fixar post');
    }

    return post as GroupPost;
  },

  reactToPost: async (postId: string, reaction: string): Promise<GroupPostReaction> => {
    // TODO: Migrar para GroupsPostsService
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Usuário não autenticado');

    const { data: existingReaction } = await supabase
      .from('group_post_reactions')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', user.user.id)
      .single();

    if (existingReaction) {
      if (existingReaction.reaction_type === reaction) {
        const { error } = await supabase
          .from('group_post_reactions')
          .delete()
          .eq('id', existingReaction.id);

        if (error) {
          console.error('Error removing reaction:', error);
          throw new Error('Erro ao remover reação');
        }

        return existingReaction as GroupPostReaction;
      } else {
        const { data: updated, error } = await supabase
          .from('group_post_reactions')
          .update({ reaction_type: reaction })
          .eq('id', existingReaction.id)
          .select(`
            *,
            user:profiles!group_post_reactions_user_id_fkey (
              id,
              full_name,
              avatar_url
            )
          `)
          .single();

        if (error) {
          console.error('Error updating reaction:', error);
          throw new Error('Erro ao atualizar reação');
        }

        return updated as GroupPostReaction;
      }
    }

    const { data: newReaction, error } = await supabase
      .from('group_post_reactions')
      .insert({
        post_id: postId,
        user_id: user.user.id,
        reaction_type: reaction
      })
      .select(`
        *,
        user:profiles!group_post_reactions_user_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Error creating reaction:', error);
      throw new Error('Erro ao criar reação');
    }

    return newReaction as GroupPostReaction;
  },

  removeReaction: async (postId: string, reaction: string): Promise<void> => {
    // TODO: Migrar para GroupsPostsService
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Usuário não autenticado');

    const { error } = await supabase
      .from('group_post_reactions')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.user.id)
      .eq('reaction_type', reaction);

    if (error) {
      console.error('Error removing reaction:', error);
      throw new Error('Erro ao remover reação');
    }
  },

  // =====================================================
  // ⚠️ CONVITES - AINDA NÃO MIGRADO (CÓDIGO LEGADO)
  // =====================================================

  getGroupInvites: async (groupId?: string): Promise<GroupInvite[]> => {
    // TODO: Migrar para GroupsInvitesService
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Usuário não autenticado');

    let queryBuilder = supabase
      .from('group_invites')
      .select(`
        *,
        group:groups!group_invites_group_id_fkey (
          id,
          name,
          description,
          category,
          is_private
        ),
        invited_user:profiles!group_invites_invited_user_id_fkey (
          id,
          full_name,
          avatar_url
        ),
        invited_by_user:profiles!group_invites_invited_by_user_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('invited_user_id', user.user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (groupId) {
      queryBuilder = queryBuilder.eq('group_id', groupId);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error fetching group invites:', error);
      throw new Error('Erro ao buscar convites');
    }

    return data as GroupInvite[];
  },

  createGroupInvite: async (groupId: string, data: CreateGroupInviteData): Promise<GroupInvite> => {
    // TODO: Migrar para GroupsInvitesService
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Usuário não autenticado');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { data: invite, error } = await supabase
      .from('group_invites')
      .insert({
        group_id: groupId,
        invited_user_id: data.invited_user_id,
        invited_by_user_id: user.user.id,
        message: data.message,
        expires_at: expiresAt.toISOString(),
        status: 'pending'
      })
      .select(`
        *,
        group:groups!group_invites_group_id_fkey (
          id,
          name,
          description,
          category,
          is_private
        ),
        invited_user:profiles!group_invites_invited_user_id_fkey (
          id,
          full_name,
          avatar_url
        ),
        invited_by_user:profiles!group_invites_invited_by_user_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Error creating group invite:', error);
      throw new Error('Erro ao criar convite');
    }

    return invite as GroupInvite;
  },

  respondToInvite: async (inviteId: string, status: 'accepted' | 'declined'): Promise<GroupInvite> => {
    // TODO: Migrar para GroupsInvitesService
    const { data: invite, error: updateError } = await supabase
      .from('group_invites')
      .update({ status })
      .eq('id', inviteId)
      .select(`
        *,
        group:groups!group_invites_group_id_fkey (
          id,
          name,
          description,
          category,
          is_private
        ),
        invited_user:profiles!group_invites_invited_user_id_fkey (
          id,
          full_name,
          avatar_url
        ),
        invited_by_user:profiles!group_invites_invited_by_user_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (updateError) {
      console.error('Error responding to invite:', updateError);
      throw new Error('Erro ao responder convite');
    }

    if (status === 'accepted') {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Usuário não autenticado');

      await supabase
        .from('group_members')
        .insert({
          group_id: invite.group_id,
          user_id: user.user.id,
          role: 'member'
        });
    }

    return invite as GroupInvite;
  },

  // =====================================================
  // ⚠️ NOTIFICAÇÕES - AINDA NÃO MIGRADO (CÓDIGO LEGADO)
  // =====================================================

  getGroupNotifications: async (unreadOnly = false): Promise<GroupNotification[]> => {
    // TODO: Migrar para GroupsNotificationsService
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Usuário não autenticado');

    let queryBuilder = supabase
      .from('group_notifications')
      .select(`
        *,
        group:groups!group_notifications_group_id_fkey (
          id,
          name,
          description,
          category,
          is_private
        )
      `)
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    if (unreadOnly) {
      queryBuilder = queryBuilder.eq('is_read', false);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error fetching group notifications:', error);
      throw new Error('Erro ao buscar notificações');
    }

    return data as GroupNotification[];
  },

  markNotificationAsRead: async (notificationId: string): Promise<void> => {
    // TODO: Migrar para GroupsNotificationsService
    const { error } = await supabase
      .from('group_notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Erro ao marcar notificação como lida');
    }
  },

  markAllNotificationsAsRead: async (): Promise<void> => {
    // TODO: Migrar para GroupsNotificationsService
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Usuário não autenticado');

    const { error } = await supabase
      .from('group_notifications')
      .update({ is_read: true })
      .eq('user_id', user.user.id)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
      throw new Error('Erro ao marcar todas as notificações como lidas');
    }
  }
};
