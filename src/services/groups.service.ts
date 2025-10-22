// =====================================================
// CLUBNATH GRUPOS TEMÁTICOS - SERVIÇO COMPLETO
// Santuário Digital de Empatia e Pertencimento
// =====================================================

import { supabase } from '../lib/supabase';
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

// =====================================================
// SERVIÇO PRINCIPAL DE GRUPOS
// =====================================================

export const groupsService: GroupService = {
  // =====================================================
  // GRUPOS
  // =====================================================
  
  async getGroups(params: GroupSearchParams = {}): Promise<Group[]> {
    const {
      query,
      category,
      is_private,
      limit = 20,
      offset = 0,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = params;

    let queryBuilder = supabase
      .from('groups')
      .select(`
        *,
        creator:profiles!groups_creator_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .range(offset, offset + limit - 1)
      .order(sort_by, { ascending: sort_order === 'asc' });

    // Filtros
    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    }
    
    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }
    
    if (typeof is_private === 'boolean') {
      queryBuilder = queryBuilder.eq('is_private', is_private);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error fetching groups:', error);
      throw new Error('Erro ao buscar grupos');
    }

    return data || [];
  },

  async getGroup(id: string): Promise<Group> {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        creator:profiles!groups_creator_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching group:', error);
      throw new Error('Erro ao buscar grupo');
    }

    // Verificar se o usuário é membro e qual seu role
    const { data: memberData } = await supabase
      .from('group_members')
      .select('role, joined_at')
      .eq('group_id', id)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .single();

    return {
      ...data,
      user_role: memberData?.role,
      user_joined_at: memberData?.joined_at
    };
  },

  async createGroup(data: CreateGroupData): Promise<Group> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Usuário não autenticado');

    // Verificar limite de grupos por usuário
    const { count } = await supabase
      .from('groups')
      .select('*', { count: 'exact', head: true })
      .eq('creator_id', user.user.id);

    if (count && count >= 5) {
      throw new Error('Você já criou o máximo de 5 grupos');
    }

    const { data: group, error } = await supabase
      .from('groups')
      .insert({
        ...data,
        creator_id: user.user.id,
        max_members: data.max_members || 50
      })
      .select(`
        *,
        creator:profiles!groups_creator_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Error creating group:', error);
      throw new Error('Erro ao criar grupo');
    }

    // Adicionar criador como admin
    await supabase
      .from('group_members')
      .insert({
        group_id: group.id,
        user_id: user.user.id,
        role: 'admin'
      });

    return {
      ...group,
      user_role: 'admin'
    };
  },

  async updateGroup(id: string, data: UpdateGroupData): Promise<Group> {
    const { data: group, error } = await supabase
      .from('groups')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        creator:profiles!groups_creator_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Error updating group:', error);
      throw new Error('Erro ao atualizar grupo');
    }

    return group;
  },

  async deleteGroup(id: string): Promise<void> {
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting group:', error);
      throw new Error('Erro ao deletar grupo');
    }
  },

  // =====================================================
  // MEMBROS
  // =====================================================

  async getGroupMembers(groupId: string, options: UseGroupMembersOptions = {}): Promise<GroupMember[]> {
    const { role, limit = 50, enabled = true } = options;

    if (!enabled) return [];

    let queryBuilder = supabase
      .from('group_members')
      .select(`
        *,
        user:profiles!group_members_user_id_fkey (
          id,
          full_name,
          avatar_url,
          bio
        )
      `)
      .eq('group_id', groupId)
      .eq('is_banned', false)
      .order('joined_at', { ascending: false });

    if (role) {
      queryBuilder = queryBuilder.eq('role', role);
    }

    if (limit) {
      queryBuilder = queryBuilder.limit(limit);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error fetching group members:', error);
      throw new Error('Erro ao buscar membros do grupo');
    }

    return data || [];
  },

  async joinGroup(groupId: string): Promise<GroupMember> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Usuário não autenticado');

    // Verificar se o grupo existe e não está cheio
    const { data: group } = await supabase
      .from('groups')
      .select('current_members, max_members, is_private')
      .eq('id', groupId)
      .single();

    if (!group) throw new Error('Grupo não encontrado');
    if (group.current_members >= group.max_members) throw new Error('Grupo está cheio');
    if (group.is_private) throw new Error('Este é um grupo privado. Você precisa de um convite.');

    const { data: member, error } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        user_id: user.user.id,
        role: 'member'
      })
      .select(`
        *,
        user:profiles!group_members_user_id_fkey (
          id,
          full_name,
          avatar_url,
          bio
        )
      `)
      .single();

    if (error) {
      console.error('Error joining group:', error);
      throw new Error('Erro ao entrar no grupo');
    }

    return member;
  },

  async leaveGroup(groupId: string): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Usuário não autenticado');

    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', user.user.id);

    if (error) {
      console.error('Error leaving group:', error);
      throw new Error('Erro ao sair do grupo');
    }
  },

  async updateMemberRole(groupId: string, userId: string, role: string): Promise<GroupMember> {
    const { data: member, error } = await supabase
      .from('group_members')
      .update({ role })
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .select(`
        *,
        user:profiles!group_members_user_id_fkey (
          id,
          full_name,
          avatar_url,
          bio
        )
      `)
      .single();

    if (error) {
      console.error('Error updating member role:', error);
      throw new Error('Erro ao atualizar role do membro');
    }

    return member;
  },

  async removeMember(groupId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error removing member:', error);
      throw new Error('Erro ao remover membro');
    }
  },

  // =====================================================
  // POSTS
  // =====================================================

  async getGroupPosts(groupId: string, options: GroupPostFilters = {}): Promise<GroupPost[]> {
    const {
      parent_post_id = null,
      is_pinned,
      user_id,
      limit = 20,
      offset = 0,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = options;

    let queryBuilder = supabase
      .from('group_posts')
      .select(`
        *,
        user:profiles!group_posts_user_id_fkey (
          id,
          full_name,
          avatar_url
        ),
        parent_post:group_posts!group_posts_parent_post_id_fkey (
          id,
          content,
          user:profiles!group_posts_user_id_fkey (
            id,
            full_name,
            avatar_url
          )
        ),
        reactions:group_post_reactions (
          id,
          user_id,
          reaction_type,
          user:profiles!group_post_reactions_user_id_fkey (
            id,
            full_name,
            avatar_url
          )
        )
      `)
      .eq('group_id', groupId)
      .eq('is_approved', true)
      .range(offset, offset + limit - 1)
      .order(sort_by, { ascending: sort_order === 'asc' });

    // Filtros
    if (parent_post_id !== undefined) {
      if (parent_post_id === null) {
        queryBuilder = queryBuilder.is('parent_post_id', null);
      } else {
        queryBuilder = queryBuilder.eq('parent_post_id', parent_post_id);
      }
    }

    if (is_pinned !== undefined) {
      queryBuilder = queryBuilder.eq('is_pinned', is_pinned);
    }

    if (user_id) {
      queryBuilder = queryBuilder.eq('user_id', user_id);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error fetching group posts:', error);
      throw new Error('Erro ao buscar posts do grupo');
    }

    // Processar reações
    const posts = (data || []).map(post => {
      const reactions = post.reactions || [];
      const reactionsCount = reactions.reduce((acc, reaction) => {
        acc[reaction.reaction_type] = (acc[reaction.reaction_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const userReaction = reactions.find(r => 
        r.user_id === (supabase.auth.getUser().then(u => u.data.user?.id))
      )?.reaction_type;

      return {
        ...post,
        reactions_count: reactionsCount,
        user_reaction: userReaction
      };
    });

    return posts;
  },

  async createGroupPost(groupId: string, data: CreateGroupPostData): Promise<GroupPost> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Usuário não autenticado');

    const { data: post, error } = await supabase
      .from('group_posts')
      .insert({
        ...data,
        group_id: groupId,
        user_id: user.user.id
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
      throw new Error('Erro ao criar post no grupo');
    }

    return post;
  },

  async updateGroupPost(postId: string, data: UpdateGroupPostData): Promise<GroupPost> {
    const { data: post, error } = await supabase
      .from('group_posts')
      .update({
        ...data,
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

    return post;
  },

  async deleteGroupPost(postId: string): Promise<void> {
    const { error } = await supabase
      .from('group_posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('Error deleting group post:', error);
      throw new Error('Erro ao deletar post');
    }
  },

  async pinGroupPost(postId: string): Promise<GroupPost> {
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

    return post;
  },

  // =====================================================
  // REAÇÕES
  // =====================================================

  async reactToPost(postId: string, reaction: string): Promise<GroupPostReaction> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Usuário não autenticado');

    // Remover reação existente do mesmo tipo
    await supabase
      .from('group_post_reactions')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.user.id)
      .eq('reaction_type', reaction);

    const { data: reactionData, error } = await supabase
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
      console.error('Error reacting to post:', error);
      throw new Error('Erro ao reagir ao post');
    }

    return reactionData;
  },

  async removeReaction(postId: string, reaction: string): Promise<void> {
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
  // CONVITES
  // =====================================================

  async getGroupInvites(groupId?: string): Promise<GroupInvite[]> {
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
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (groupId) {
      queryBuilder = queryBuilder.eq('group_id', groupId);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error fetching group invites:', error);
      throw new Error('Erro ao buscar convites');
    }

    return data || [];
  },

  async createGroupInvite(groupId: string, data: CreateGroupInviteData): Promise<GroupInvite> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Usuário não autenticado');

    const { data: invite, error } = await supabase
      .from('group_invites')
      .insert({
        ...data,
        group_id: groupId,
        invited_by_user_id: user.user.id
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

    return invite;
  },

  async respondToInvite(inviteId: string, status: 'accepted' | 'declined'): Promise<GroupInvite> {
    const { data: invite, error } = await supabase
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
        )
      `)
      .single();

    if (error) {
      console.error('Error responding to invite:', error);
      throw new Error('Erro ao responder convite');
    }

    // Se aceito, adicionar ao grupo
    if (status === 'accepted') {
      await this.joinGroup(invite.group_id);
    }

    return invite;
  },

  // =====================================================
  // NOTIFICAÇÕES
  // =====================================================

  async getGroupNotifications(unreadOnly = false): Promise<GroupNotification[]> {
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

    return data || [];
  },

  async markNotificationAsRead(notificationId: string): Promise<GroupNotification> {
    const { data: notification, error } = await supabase
      .from('group_notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
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
      .single();

    if (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Erro ao marcar notificação como lida');
    }

    return notification;
  },

  async markAllNotificationsAsRead(): Promise<void> {
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

// =====================================================
// HOOKS PERSONALIZADOS PARA GRUPOS
// =====================================================

export const useGroups = (params?: GroupSearchParams) => {
  return {
    queryKey: ['groups', params],
    queryFn: () => groupsService.getGroups(params)
  };
};

export const useGroup = (id: string) => {
  return {
    queryKey: ['group', id],
    queryFn: () => groupsService.getGroup(id)
  };
};

export const useGroupMembers = (groupId: string, options?: UseGroupMembersOptions) => {
  return {
    queryKey: ['group-members', groupId, options],
    queryFn: () => groupsService.getGroupMembers(groupId, options)
  };
};

export const useGroupPosts = (groupId: string, options?: GroupPostFilters) => {
  return {
    queryKey: ['group-posts', groupId, options],
    queryFn: () => groupsService.getGroupPosts(groupId, options)
  };
};

export const useGroupInvites = (groupId?: string) => {
  return {
    queryKey: ['group-invites', groupId],
    queryFn: () => groupsService.getGroupInvites(groupId)
  };
};

export const useGroupNotifications = (unreadOnly = false) => {
  return {
    queryKey: ['group-notifications', unreadOnly],
    queryFn: () => groupsService.getGroupNotifications(unreadOnly)
  };
};

// =====================================================
// UTILITÁRIOS PARA GRUPOS
// =====================================================

export const getGroupStats = async (groupId: string) => {
  const [members, posts, reactions] = await Promise.all([
    groupsService.getGroupMembers(groupId),
    groupsService.getGroupPosts(groupId, { limit: 1000 }),
    supabase
      .from('group_post_reactions')
      .select('*')
      .in('post_id', (await groupsService.getGroupPosts(groupId, { limit: 1000 })).map(p => p.id))
  ]);

  return {
    total_members: members.length,
    total_posts: posts.length,
    total_reactions: reactions.data?.length || 0,
    active_members: members.filter(m => {
      const lastSeen = new Date(m.last_seen_at);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return lastSeen > weekAgo;
    }).length
  };
};

export const searchGroups = async (query: string, category?: string) => {
  return groupsService.getGroups({
    query,
    category: category as any,
    limit: 20
  });
};

export const getPopularGroups = async () => {
  return groupsService.getGroups({
    sort_by: 'current_members',
    sort_order: 'desc',
    limit: 10
  });
};

export const getRecentGroups = async () => {
  return groupsService.getGroups({
    sort_by: 'created_at',
    sort_order: 'desc',
    limit: 10
  });
};

export const getUserGroups = async (userId: string) => {
  const { data, error } = await supabase
    .from('group_members')
    .select(`
      *,
      group:groups!group_members_group_id_fkey (
        *,
        creator:profiles!groups_creator_id_fkey (
          id,
          full_name,
          avatar_url
        )
      )
    `)
    .eq('user_id', userId)
    .eq('is_banned', false)
    .order('joined_at', { ascending: false });

  if (error) {
    console.error('Error fetching user groups:', error);
    throw new Error('Erro ao buscar grupos do usuário');
  }

  return data?.map(member => ({
    ...member.group,
    user_role: member.role,
    user_joined_at: member.joined_at
  })) || [];
};

export const getCreatedGroups = async (userId: string) => {
  return groupsService.getGroups().then(groups => 
    groups.filter(group => group.creator_id === userId)
  );
};

// =====================================================
// MODERAÇÃO E SEGURANÇA
// =====================================================

export const moderatePost = async (postId: string, action: 'approve' | 'reject' | 'delete') => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Usuário não autenticado');

  switch (action) {
    case 'approve':
      return groupsService.updateGroupPost(postId, { is_approved: true });
    case 'reject':
      return groupsService.updateGroupPost(postId, { is_approved: false });
    case 'delete':
      return groupsService.deleteGroupPost(postId);
    default:
      throw new Error('Ação de moderação inválida');
  }
};

export const banUserFromGroup = async (groupId: string, userId: string) => {
  const { error } = await supabase
    .from('group_members')
    .update({ is_banned: true })
    .eq('group_id', groupId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error banning user from group:', error);
    throw new Error('Erro ao banir usuário do grupo');
  }
};

export const muteUserInGroup = async (groupId: string, userId: string, muted: boolean) => {
  const { error } = await supabase
    .from('group_members')
    .update({ is_muted: muted })
    .eq('group_id', groupId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error muting user in group:', error);
    throw new Error('Erro ao silenciar usuário no grupo');
  }
};

// =====================================================
// EXPORT DEFAULT
// =====================================================

export default groupsService;
