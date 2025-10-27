// =====================================================
// GROUPS MEMBERS SERVICE - BUSINESS LOGIC LAYER
// =====================================================
// Responsável por lógica de negócio de Membros de Grupos
// =====================================================

import { supabase } from '../../../lib/supabase';
import { GroupsRepository } from '../repositories/groups.repository';
import { GroupMembersRepository } from '../repositories/group-members.repository';
import type {
  GroupMember,
  UseGroupMembersOptions
} from '../../../types/groups';

/**
 * Service para lógica de negócio de Membros de Grupos.
 *
 * @example
 * ```typescript
 * const members = await GroupsMembersService.getMembers('group-123');
 * await GroupsMembersService.joinGroup('group-123');
 * await GroupsMembersService.leaveGroup('group-123');
 * ```
 */
export const GroupsMembersService = {
  /**
   * Busca membros de um grupo.
   *
   * @param groupId - ID do grupo
   * @param options - Opções de filtro
   * @returns Promise com array de membros
   */
  async getMembers(
    groupId: string,
    options: UseGroupMembersOptions = {}
  ): Promise<GroupMember[]> {
    const { role, limit = 50, enabled = true } = options;

    if (!enabled) return [];

    try {
      const members = await GroupMembersRepository.findByGroupId(groupId, {
        role,
        limit,
        isBanned: false
      });

      return members as GroupMember[];
    } catch (error) {
      console.error('Error fetching group members:', error);
      throw new Error('Erro ao buscar membros do grupo');
    }
  },

  /**
   * Adiciona usuário autenticado a um grupo.
   *
   * Regras de negócio:
   * - Usuário deve estar autenticado
   * - Grupo não pode estar cheio (max_members)
   * - Usuário não pode já ser membro
   * - Grupo privado requer convite (TODO)
   *
   * @param groupId - ID do grupo
   * @returns Promise com o membro criado
   * @throws Error se validações falharem
   */
  async joinGroup(groupId: string): Promise<GroupMember> {
    // 1. Validar autenticação
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      // 2. Verificar se grupo existe
      const group = await GroupsRepository.findById(groupId);

      if (!group) {
        throw new Error('Grupo não encontrado');
      }

      // 3. Verificar se usuário já é membro
      const existingMember = await GroupMembersRepository.findByGroupAndUser(
        groupId,
        user.user.id
      );

      if (existingMember) {
        throw new Error('Você já é membro deste grupo');
      }

      // 4. Verificar limite de membros
      const currentMembersCount = await GroupMembersRepository.countByGroupId(groupId);

      if (currentMembersCount >= group.max_members) {
        throw new Error('Este grupo atingiu o limite máximo de membros');
      }

      // 5. Adicionar membro
      const member = await GroupMembersRepository.create({
        group_id: groupId,
        user_id: user.user.id,
        role: 'member'
      });

      return member as GroupMember;
    } catch (error) {
      console.error('Error joining group:', error);

      // Re-throw business logic errors
      if (error instanceof Error && (
        error.message.includes('já é membro') ||
        error.message.includes('limite máximo') ||
        error.message.includes('não encontrado')
      )) {
        throw error;
      }

      throw new Error('Erro ao entrar no grupo');
    }
  },

  /**
   * Remove usuário autenticado de um grupo.
   *
   * Regras de negócio:
   * - Usuário deve estar autenticado
   * - Criador não pode sair do próprio grupo
   * - Admin precisa transferir ownership primeiro (TODO)
   *
   * @param groupId - ID do grupo
   * @returns Promise void
   * @throws Error se validações falharem
   */
  async leaveGroup(groupId: string): Promise<void> {
    // 1. Validar autenticação
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      // 2. Verificar se é o criador
      const group = await GroupsRepository.findById(groupId);

      if (!group) {
        throw new Error('Grupo não encontrado');
      }

      if (group.creator_id === user.user.id) {
        throw new Error('Criador do grupo não pode sair. Delete o grupo ao invés disso.');
      }

      // 3. Remover membro
      await GroupMembersRepository.delete(groupId, user.user.id);
    } catch (error) {
      console.error('Error leaving group:', error);

      // Re-throw business logic errors
      if (error instanceof Error && error.message.includes('Criador')) {
        throw error;
      }

      throw new Error('Erro ao sair do grupo');
    }
  },

  /**
   * Atualiza role de um membro (admin, moderator, member).
   *
   * Regras de negócio:
   * - Apenas admin pode alterar roles
   * - Não pode alterar role do criador
   *
   * @param groupId - ID do grupo
   * @param userId - ID do usuário
   * @param role - Nova role
   * @returns Promise com o membro atualizado
   */
  async updateMemberRole(
    groupId: string,
    userId: string,
    role: string
  ): Promise<GroupMember> {
    try {
      // TODO: Validar que usuário atual é admin
      // TODO: Validar que não está alterando criador

      const member = await GroupMembersRepository.update(groupId, userId, {
        role
      });

      return member as GroupMember;
    } catch (error) {
      console.error('Error updating member role:', error);
      throw new Error('Erro ao atualizar role do membro');
    }
  },

  /**
   * Remove um membro do grupo (kick).
   *
   * Regras de negócio:
   * - Apenas admin pode remover membros
   * - Não pode remover o criador
   * - Não pode remover a si mesmo (use leaveGroup)
   *
   * @param groupId - ID do grupo
   * @param userId - ID do usuário a ser removido
   * @returns Promise void
   */
  async removeMember(groupId: string, userId: string): Promise<void> {
    try {
      // TODO: Validar permissões
      await GroupMembersRepository.delete(groupId, userId);
    } catch (error) {
      console.error('Error removing member:', error);
      throw new Error('Erro ao remover membro');
    }
  },

  /**
   * Busca grupos que o usuário autenticado é membro.
   *
   * @returns Promise com array de grupos
   */
  async getUserGroups(): Promise<GroupMember[]> {
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const memberships = await GroupMembersRepository.findByUserId(user.user.id);
      return memberships as GroupMember[];
    } catch (error) {
      console.error('Error fetching user groups:', error);
      throw new Error('Erro ao buscar grupos do usuário');
    }
  }
};
