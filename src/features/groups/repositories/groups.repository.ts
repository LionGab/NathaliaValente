// =====================================================
// GROUPS REPOSITORY - DATA ACCESS LAYER
// =====================================================
// Responsável APENAS por comunicação com Supabase
// NÃO contém lógica de negócio
// =====================================================

import { supabase } from '../../../lib/supabase';
import type { Database } from '../../../types/database';

// Tipos do Supabase
type GroupRow = Database['public']['Tables']['groups']['Row'];
type GroupInsert = Database['public']['Tables']['groups']['Insert'];
type GroupUpdate = Database['public']['Tables']['groups']['Update'];

/**
 * Repository para acesso a dados de Grupos.
 *
 * Princípios:
 * - APENAS acesso a dados (queries)
 * - SEM lógica de negócio
 * - SEM validações complexas
 * - Retorna dados brutos do Supabase
 *
 * @example
 * ```typescript
 * const groups = await GroupsRepository.findAll({ limit: 10 });
 * const group = await GroupsRepository.findById('group-123');
 * ```
 */
export const GroupsRepository = {
  /**
   * Busca todos os grupos com filtros opcionais.
   *
   * @param options - Opções de filtro e paginação
   * @returns Promise com array de grupos
   */
  async findAll(
    options: {
      query?: string;
      category?: string;
      isPrivate?: boolean;
      limit?: number;
      offset?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<GroupRow[]> {
    const {
      query,
      category,
      isPrivate,
      limit = 20,
      offset = 0,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = options;

    let queryBuilder = supabase
      .from('groups')
      .select(
        `
        *,
        creator:profiles!groups_creator_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `
      )
      .range(offset, offset + limit - 1)
      .order(sortBy, { ascending: sortOrder === 'asc' });

    // Aplicar filtros
    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    }

    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }

    if (typeof isPrivate === 'boolean') {
      queryBuilder = queryBuilder.eq('is_private', isPrivate);
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;
    return data || [];
  },

  /**
   * Busca um grupo por ID.
   *
   * @param id - ID do grupo
   * @returns Promise com o grupo ou null
   */
  async findById(id: string): Promise<GroupRow | null> {
    const { data, error } = await supabase
      .from('groups')
      .select(
        `
        *,
        creator:profiles!groups_creator_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data;
  },

  /**
   * Busca grupos criados por um usuário específico.
   *
   * @param creatorId - ID do criador
   * @param limit - Número máximo de resultados
   * @returns Promise com array de grupos
   */
  async findByCreatorId(creatorId: string, limit = 50): Promise<GroupRow[]> {
    const { data, error } = await supabase
      .from('groups')
      .select(
        `
        *,
        creator:profiles!groups_creator_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `
      )
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  /**
   * Conta quantos grupos um usuário criou.
   *
   * @param creatorId - ID do criador
   * @returns Promise com o número de grupos
   */
  async countByCreatorId(creatorId: string): Promise<number> {
    const { count, error } = await supabase
      .from('groups')
      .select('*', { count: 'exact', head: true })
      .eq('creator_id', creatorId);

    if (error) throw error;
    return count || 0;
  },

  /**
   * Cria um novo grupo.
   *
   * @param data - Dados do grupo a ser criado
   * @returns Promise com o grupo criado
   */
  async create(data: GroupInsert): Promise<GroupRow> {
    const { data: group, error } = await supabase
      .from('groups')
      .insert(data)
      .select(
        `
        *,
        creator:profiles!groups_creator_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `
      )
      .single();

    if (error) throw error;
    return group;
  },

  /**
   * Atualiza um grupo existente.
   *
   * @param id - ID do grupo
   * @param data - Dados a serem atualizados
   * @returns Promise com o grupo atualizado
   */
  async update(id: string, data: GroupUpdate): Promise<GroupRow> {
    const { data: group, error } = await supabase
      .from('groups')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(
        `
        *,
        creator:profiles!groups_creator_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `
      )
      .single();

    if (error) throw error;
    return group;
  },

  /**
   * Deleta um grupo.
   *
   * @param id - ID do grupo a ser deletado
   * @returns Promise void
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('groups').delete().eq('id', id);

    if (error) throw error;
  },

  /**
   * Verifica se um usuário é membro de um grupo.
   *
   * @param groupId - ID do grupo
   * @param userId - ID do usuário
   * @returns Promise com os dados do membro ou null
   */
  async findMembership(groupId: string, userId: string) {
    const { data, error } = await supabase
      .from('group_members')
      .select('*')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data;
  },
};
