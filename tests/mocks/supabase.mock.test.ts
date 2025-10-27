// =====================================================
// EXEMPLO DE USO DO MOCK DO SUPABASE
// =====================================================

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  setupSupabaseMock,
  resetMocks,
  mockAuthUser,
  mockAuthError,
  mockGroupsSuccess,
  mockGroupsError,
  mockQueryResponse,
  mockQueryError,
  mockQuerySuccess,
  mockCreateGroupSuccess,
  mockCreateGroupError,
  mockUser,
  mockGroups
} from './supabase.mock';

// =====================================================
// CONFIGURAÇÃO DO MOCK
// =====================================================

// Mock do Supabase ANTES de importar qualquer coisa
setupSupabaseMock();

// Importar o serviço DEPOIS do mock
import { groupsService } from '../../src/services/groups.service';
import type { CreateGroupData } from '../../src/types/groups';

// =====================================================
// EXEMPLOS DE TESTES
// =====================================================

describe('Exemplo de Uso do Mock Supabase', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('getGroups', () => {
    it('deve retornar lista de grupos com sucesso', async () => {
      // Arrange - Usar helper específico
      mockGroupsSuccess();

      // Act
      const result = await groupsService.getGroups();

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Mães de Fé');
      expect(result[1].name).toBe('Mães Trabalhadoras');
    });

    it('deve retornar array vazio quando não há grupos', async () => {
      // Arrange - Usar helper específico
      mockGroupsSuccess([]);

      // Act
      const result = await groupsService.getGroups();

      // Assert
      expect(result).toEqual([]);
    });

    it('deve lançar erro quando Supabase retorna erro', async () => {
      // Arrange - Usar helper específico
      mockGroupsError('Erro de conexão com o banco');

      // Act & Assert
      await expect(groupsService.getGroups()).rejects.toThrow('Erro ao buscar grupos');
    });
  });

  describe('getGroup', () => {
    it('deve retornar grupo específico com informações do usuário', async () => {
      // Arrange - Configurar mocks específicos
      const mockGroup = mockGroups[0];
      const mockMember = {
        id: 'member-1',
        group_id: 'group-1',
        user_id: 'user-123',
        role: 'admin',
        joined_at: '2024-01-01T00:00:00Z'
      };

      // Mock das chamadas sequenciais
      mockQueryResponse('groups', mockQuerySuccess(mockGroup));
      mockQueryResponse('group_members', mockQuerySuccess(mockMember));

      // Act
      const result = await groupsService.getGroup('group-1');

      // Assert
      expect(result).toEqual({
        ...mockGroup,
        user_role: mockMember.role,
        user_joined_at: mockMember.joined_at
      });
    });

    it('deve lançar erro quando grupo não é encontrado', async () => {
      // Arrange
      mockQueryError('groups', 'Grupo não encontrado');

      // Act & Assert
      await expect(groupsService.getGroup('group-inexistente')).rejects.toThrow('Erro ao buscar grupo');
    });
  });

  describe('createGroup', () => {
    it('deve criar grupo com sucesso', async () => {
      // Arrange
      const groupData: CreateGroupData = {
        name: 'Novo Grupo',
        description: 'Descrição do novo grupo',
        category: 'Fé',
        is_private: false,
        max_members: 30,
        cover_image_url: 'https://example.com/cover.jpg',
        rules: 'Seja respeitosa'
      };

      const mockCreatedGroup = {
        id: 'group-new',
        ...groupData,
        creator_id: 'user-123',
        current_members: 1,
        created_at: '2024-01-16T00:00:00Z',
        updated_at: '2024-01-16T00:00:00Z',
        creator: {
          id: 'user-123',
          full_name: 'Usuária Teste',
          avatar_url: 'https://example.com/avatar.jpg'
        }
      };

      // Mock das chamadas sequenciais
      mockQueryResponse('groups', mockQuerySuccess(null, 2)); // Count query
      mockCreateGroupSuccess(mockCreatedGroup); // Create group
      mockQueryResponse('group_members', mockQuerySuccess({})); // Add member

      // Act
      const result = await groupsService.createGroup(groupData);

      // Assert
      expect(result).toEqual({
        ...mockCreatedGroup,
        user_role: 'admin'
      });
    });

    it('deve lançar erro quando usuário não está autenticado', async () => {
      // Arrange
      mockAuthError('Usuário não autenticado');

      const groupData: CreateGroupData = {
        name: 'Novo Grupo',
        description: 'Descrição do novo grupo',
        category: 'Fé',
        is_private: false
      };

      // Act & Assert
      await expect(groupsService.createGroup(groupData)).rejects.toThrow('Usuário não autenticado');
    });

    it('deve lançar erro quando usuário já criou o máximo de grupos', async () => {
      // Arrange
      const groupData: CreateGroupData = {
        name: 'Novo Grupo',
        description: 'Descrição do novo grupo',
        category: 'Fé',
        is_private: false
      };

      // Mock count query retornando 5 grupos (limite)
      mockQueryResponse('groups', mockQuerySuccess(null, 5));

      // Act & Assert
      await expect(groupsService.createGroup(groupData)).rejects.toThrow('Você já criou o máximo de 5 grupos');
    });

    it('deve lançar erro quando criação falha', async () => {
      // Arrange
      const groupData: CreateGroupData = {
        name: 'Novo Grupo',
        description: 'Descrição do novo grupo',
        category: 'Fé',
        is_private: false
      };

      // Mock count query retornando 2 grupos (dentro do limite)
      mockQueryResponse('groups', mockQuerySuccess(null, 2));
      // Mock create group falhando
      mockCreateGroupError('Erro ao criar grupo');

      // Act & Assert
      await expect(groupsService.createGroup(groupData)).rejects.toThrow('Erro ao criar grupo');
    });
  });

  describe('updateGroup', () => {
    it('deve atualizar grupo com sucesso', async () => {
      // Arrange
      const groupId = 'group-1';
      const updateData = {
        name: 'Nome Atualizado',
        description: 'Descrição atualizada'
      };

      const mockUpdatedGroup = {
        ...mockGroups[0],
        ...updateData,
        updated_at: '2024-01-16T00:00:00Z'
      };

      mockUpdateGroupSuccess(mockUpdatedGroup);

      // Act
      const result = await groupsService.updateGroup(groupId, updateData);

      // Assert
      expect(result).toEqual(mockUpdatedGroup);
    });

    it('deve lançar erro quando atualização falha', async () => {
      // Arrange
      const groupId = 'group-1';
      const updateData = {
        name: 'Nome Atualizado'
      };

      mockUpdateGroupError('Erro ao atualizar grupo');

      // Act & Assert
      await expect(groupsService.updateGroup(groupId, updateData)).rejects.toThrow('Erro ao atualizar grupo');
    });
  });

  describe('deleteGroup', () => {
    it('deve deletar grupo com sucesso', async () => {
      // Arrange
      const groupId = 'group-1';
      mockDeleteGroupSuccess();

      // Act
      await groupsService.deleteGroup(groupId);

      // Assert - Não deve lançar erro
      expect(true).toBe(true);
    });

    it('deve lançar erro quando deleção falha', async () => {
      // Arrange
      const groupId = 'group-1';
      mockDeleteGroupError('Erro ao deletar grupo');

      // Act & Assert
      await expect(groupsService.deleteGroup(groupId)).rejects.toThrow('Erro ao deletar grupo');
    });
  });

  describe('Autenticação', () => {
    it('deve funcionar com usuário autenticado', async () => {
      // Arrange
      const customUser = {
        id: 'user-456',
        email: 'custom@example.com',
        user_metadata: {
          full_name: 'Usuária Customizada',
          avatar_url: 'https://example.com/custom-avatar.jpg'
        }
      };

      mockAuthUser(customUser);
      mockGroupsSuccess();

      // Act
      const result = await groupsService.getGroups();

      // Assert
      expect(result).toHaveLength(2);
    });

    it('deve falhar com usuário não autenticado', async () => {
      // Arrange
      mockAuthError('Sessão expirada');
      mockGroupsSuccess();

      // Act & Assert
      await expect(groupsService.getGroups()).rejects.toThrow('Erro ao buscar grupos');
    });
  });

  describe('Configuração Customizada', () => {
    it('deve permitir configurar resposta customizada', async () => {
      // Arrange
      const customGroups = [
        {
          id: 'custom-group',
          name: 'Grupo Customizado',
          description: 'Descrição customizada',
          category: 'Custom',
          creator_id: 'user-123',
          is_private: false,
          max_members: 10,
          current_members: 5,
          created_at: '2024-01-16T00:00:00Z',
          updated_at: '2024-01-16T00:00:00Z',
          creator: {
            id: 'user-123',
            full_name: 'Usuária Teste',
            avatar_url: 'https://example.com/avatar.jpg'
          }
        }
      ];

      mockQueryResponse('groups', mockQuerySuccess(customGroups));

      // Act
      const result = await groupsService.getGroups();

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Grupo Customizado');
    });

    it('deve permitir configurar erro customizado', async () => {
      // Arrange
      mockQueryError('groups', 'Erro customizado', 'CUSTOM_ERROR');

      // Act & Assert
      await expect(groupsService.getGroups()).rejects.toThrow('Erro ao buscar grupos');
    });
  });
});
