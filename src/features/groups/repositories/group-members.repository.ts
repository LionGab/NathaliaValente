// =====================================================
// GROUP MEMBERS REPOSITORY - DATA ACCESS LAYER
// =====================================================
// Responsável APENAS por comunicação com Supabase
// NÃO contém lógica de negócio
// =====================================================

import { supabase } from '../../../lib/supabase';
import type { Database } from '../../../types/database';

// Tipos do Supabase
type GroupMemberRow = Database['public']['Tables']['group_members']['Row'];
type GroupMemberInsert = Database['public']['Tables']['group_members']['Insert'];
type GroupMemberUpdate = Database['public']['Tables']['group_members']['Update'];

/**
 * Repository para acesso a dados de Membros de Grupos.
 *
 * @example
 * ```typescript
 * const members = await GroupMembersRepository.findByGroupId('group-123');
 * await GroupMembersRepository.create({ group_id: 'group-123', user_id: 'user-456', role: 'member' });
 * ```
 */
export const GroupMembersRepository = {
  /**
   * Busca todos os membros de um grupo.
   *
   * @param groupId - ID do grupo
   * @param options - Opções de filtro
   * @returns Promise com array de membros
   */
  async findByGroupId(
    groupId: string,
    options: {
      role?: string;
      limit?: number;
      isBanned?: boolean;
    } = {}
  ): Promise<GroupMemberRow[]> {
    const { role, limit = 50, isBanned = false } = options;

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
      .eq('is_banned', isBanned)
      .order('joined_at', { ascending: false })
      .limit(limit);

    if (role) {
      queryBuilder = queryBuilder.eq('role', role);
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;
    return data || [];
  },

  /**
   * Busca um membro específico.
   *
   * @param groupId - ID do grupo
   * @param userId - ID do usuário
   * @returns Promise com o membro ou null
   */
  async findByGroupAndUser(groupId: string, userId: string): Promise<GroupMemberRow | null> {
    const { data, error } = await supabase
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
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data;
  },

  /**
   * Busca todos os grupos que um usuário é membro.
   *
   * @param userId - ID do usuário
   * @param limit - Número máximo de resultados
   * @returns Promise com array de memberships
   */
  async findByUserId(userId: string, limit = 50): Promise<GroupMemberRow[]> {
    const { data, error } = await supabase
      .from('group_members')
      .select(`
        *,
        group:groups!group_members_group_id_fkey (
          id,
          name,
          description,
          category,
          is_private,
          cover_image_url
        )
      `)
      .eq('user_id', userId)
      .eq('is_banned', false)
      .order('joined_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  /**
   * Adiciona um membro a um grupo.
   *
   * @param data - Dados do membro
   * @returns Promise com o membro criado
   */
  async create(data: GroupMemberInsert): Promise<GroupMemberRow> {
    const { data: member, error } = await supabase
      .from('group_members')
      .insert(data)
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

    if (error) throw error;
    return member;
  },

  /**
   * Atualiza um membro (role, mute, ban, etc).
   *
   * @param groupId - ID do grupo
   * @param userId - ID do usuário
   * @param data - Dados a serem atualizados
   * @returns Promise com o membro atualizado
   */
  async update(
    groupId: string,
    userId: string,
    data: GroupMemberUpdate
  ): Promise<GroupMemberRow> {
    const { data: member, error } = await supabase
      .from('group_members')
      .update(data)
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

    if (error) throw error;
    return member;
  },

  /**
   * Remove um membro de um grupo.
   *
   * @param groupId - ID do grupo
   * @param userId - ID do usuário
   * @returns Promise void
   */
  async delete(groupId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  /**
   * Conta quantos membros um grupo tem.
   *
   * @param groupId - ID do grupo
   * @param isBanned - Se deve contar apenas banidos ou não-banidos
   * @returns Promise com o número de membros
   */
  async countByGroupId(groupId: string, isBanned = false): Promise<number> {
    const { count, error } = await supabase
      .from('group_members')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', groupId)
      .eq('is_banned', isBanned);

    if (error) throw error;
    return count || 0;
  }
};
