// =====================================================
// GROUPS CORE SERVICE - BUSINESS LOGIC LAYER
// =====================================================
// Responsável por lógica de negócio de CRUD de Grupos
// Usa Repositories para acesso a dados
// =====================================================

import { supabase } from '../../../lib/supabase';
import { GroupsRepository } from '../repositories/groups.repository';
import { GroupMembersRepository } from '../repositories/group-members.repository';
import type {
  Group,
  CreateGroupData,
  UpdateGroupData,
  GroupSearchParams
} from '../../../types/groups';

/**
 * Limite máximo de grupos que um usuário pode criar.
 * Usuários premium podem criar mais grupos.
 */
const MAX_GROUPS_PER_USER = 5;

/**
 * Service para lógica de negócio de Grupos.
 *
 * Responsabilidades:
 * - Validações de negócio
 * - Regras de criação/edição
 * - Orquestração de operações complexas
 * - Autorização e permissões
 *
 * @example
 * ```typescript
 * const groups = await GroupsCoreService.getGroups({ limit: 10 });
 * const newGroup = await GroupsCoreService.createGroup({
 *   name: 'Mães de Fé',
 *   category: 'Fé',
 *   is_private: false
 * });
 * ```
 */
export const GroupsCoreService = {
  /**
   * Busca grupos com filtros opcionais.
   *
   * @param params - Parâmetros de busca e paginação
   * @returns Promise com array de grupos
   */
  async getGroups(params: GroupSearchParams = {}): Promise<Group[]> {
    try {
      const groups = await GroupsRepository.findAll({
        query: params.query,
        category: params.category,
        isPrivate: params.is_private,
        limit: params.limit,
        offset: params.offset,
        sortBy: params.sort_by,
        sortOrder: params.sort_order
      });

      return groups as Group[];
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw new Error('Erro ao buscar grupos');
    }
  },

  /**
   * Busca um grupo específico por ID.
   *
   * Adiciona informações de membership do usuário atual se autenticado.
   *
   * @param id - ID do grupo
   * @returns Promise com o grupo
   * @throws Error se o grupo não for encontrado
   */
  async getGroup(id: string): Promise<Group> {
    try {
      const group = await GroupsRepository.findById(id);

      if (!group) {
        throw new Error('Grupo não encontrado');
      }

      // Tentar buscar informações de membership do usuário atual
      const { data: user } = await supabase.auth.getUser();

      if (user?.user) {
        try {
          const membership = await GroupMembersRepository.findByGroupAndUser(
            id,
            user.user.id
          );

          if (membership) {
            return {
              ...group,
              user_role: membership.role,
              user_joined_at: membership.joined_at
            } as Group;
          }
        } catch (membershipError) {
          // Ignorar erro de membership - usuário pode não ser membro
          console.debug('User is not a member of this group');
        }
      }

      return group as Group;
    } catch (error) {
      console.error('Error fetching group:', error);
      throw new Error('Erro ao buscar grupo');
    }
  },

  /**
   * Cria um novo grupo.
   *
   * Regras de negócio:
   * - Usuário deve estar autenticado
   * - Limite de 5 grupos por usuário (pode ser aumentado para premium)
   * - Criador é automaticamente adicionado como admin
   * - max_members padrão: 50
   *
   * @param data - Dados do grupo a ser criado
   * @returns Promise com o grupo criado
   * @throws Error se validações falharem
   */
  async createGroup(data: CreateGroupData): Promise<Group> {
    // 1. Validar autenticação
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      // 2. Verificar limite de grupos por usuário
      const groupsCount = await GroupsRepository.countByCreatorId(user.user.id);

      if (groupsCount >= MAX_GROUPS_PER_USER) {
        throw new Error(`Você já criou o máximo de ${MAX_GROUPS_PER_USER} grupos`);
      }

      // 3. Criar grupo
      const group = await GroupsRepository.create({
        ...data,
        creator_id: user.user.id,
        max_members: data.max_members || 50
      });

      // 4. Adicionar criador como admin
      await GroupMembersRepository.create({
        group_id: group.id,
        user_id: user.user.id,
        role: 'admin'
      });

      // 5. Retornar grupo com informações de membership
      return {
        ...group,
        user_role: 'admin'
      } as Group;
    } catch (error) {
      console.error('Error creating group:', error);

      // Re-throw business logic errors
      if (error instanceof Error && error.message.includes('máximo')) {
        throw error;
      }

      throw new Error('Erro ao criar grupo');
    }
  },

  /**
   * Atualiza um grupo existente.
   *
   * Regras de negócio:
   * - Apenas o criador ou admin pode atualizar
   * - updated_at é atualizado automaticamente
   *
   * @param id - ID do grupo
   * @param data - Dados a serem atualizados
   * @returns Promise com o grupo atualizado
   * @throws Error se validações falharem
   */
  async updateGroup(id: string, data: UpdateGroupData): Promise<Group> {
    try {
      // TODO: Adicionar validação de permissão (apenas criador/admin)
      const group = await GroupsRepository.update(id, data);

      return group as Group;
    } catch (error) {
      console.error('Error updating group:', error);
      throw new Error('Erro ao atualizar grupo');
    }
  },

  /**
   * Deleta um grupo.
   *
   * Regras de negócio:
   * - Apenas o criador pode deletar
   * - Cascade delete de membros, posts, etc (via DB)
   *
   * @param id - ID do grupo a ser deletado
   * @returns Promise void
   * @throws Error se validações falharem
   */
  async deleteGroup(id: string): Promise<void> {
    try {
      // TODO: Adicionar validação de permissão (apenas criador)
      await GroupsRepository.delete(id);
    } catch (error) {
      console.error('Error deleting group:', error);
      throw new Error('Erro ao deletar grupo');
    }
  },

  /**
   * Busca grupos criados por um usuário.
   *
   * @param userId - ID do usuário criador (opcional, usa usuário autenticado)
   * @returns Promise com array de grupos
   */
  async getCreatedGroups(userId?: string): Promise<Group[]> {
    const { data: user } = await supabase.auth.getUser();
    const targetUserId = userId || user.user?.id;

    if (!targetUserId) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const groups = await GroupsRepository.findByCreatorId(targetUserId);
      return groups as Group[];
    } catch (error) {
      console.error('Error fetching created groups:', error);
      throw new Error('Erro ao buscar grupos criados');
    }
  }
};
