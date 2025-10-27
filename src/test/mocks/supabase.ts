// =====================================================
// MOCK DO SUPABASE PARA TESTES
// =====================================================

import { vi } from 'vitest';
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
  UseGroupMembersOptions
} from '../../types/groups';

// =====================================================
// DADOS MOCK
// =====================================================

export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Usuária Teste',
    avatar_url: 'https://example.com/avatar.jpg'
  }
};

export const mockGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Mães de Fé',
    description: 'Grupo para mães que querem crescer na fé',
    category: 'Fé',
    creator_id: 'user-123',
    is_private: false,
    max_members: 50,
    current_members: 25,
    cover_image_url: 'https://example.com/cover1.jpg',
    rules: 'Seja respeitosa e acolhedora',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    creator: {
      id: 'user-123',
      full_name: 'Usuária Teste',
      avatar_url: 'https://example.com/avatar.jpg'
    },
    user_role: 'admin',
    user_joined_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'group-2',
    name: 'Amamentação e Cuidados',
    description: 'Compartilhando experiências sobre amamentação',
    category: 'Amamentação',
    creator_id: 'user-456',
    is_private: true,
    max_members: 30,
    current_members: 15,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    creator: {
      id: 'user-456',
      full_name: 'Mãe Experiente',
      avatar_url: 'https://example.com/avatar2.jpg'
    }
  }
];

export const mockGroupMembers: GroupMember[] = [
  {
    id: 'member-1',
    group_id: 'group-1',
    user_id: 'user-123',
    role: 'admin',
    joined_at: '2024-01-01T00:00:00Z',
    last_seen_at: '2024-01-15T10:00:00Z',
    is_muted: false,
    is_banned: false,
    user: {
      id: 'user-123',
      full_name: 'Usuária Teste',
      avatar_url: 'https://example.com/avatar.jpg',
      bio: 'Mãe dedicada e cristã'
    }
  },
  {
    id: 'member-2',
    group_id: 'group-1',
    user_id: 'user-789',
    role: 'member',
    joined_at: '2024-01-05T00:00:00Z',
    last_seen_at: '2024-01-14T15:30:00Z',
    is_muted: false,
    is_banned: false,
    user: {
      id: 'user-789',
      full_name: 'Mãe Nova',
      avatar_url: 'https://example.com/avatar3.jpg',
      bio: 'Primeira vez sendo mãe'
    }
  }
];

export const mockGroupPosts: GroupPost[] = [
  {
    id: 'post-1',
    group_id: 'group-1',
    user_id: 'user-123',
    content: 'Bom dia, mães! Como foi a noite de vocês?',
    media_url: 'https://example.com/image1.jpg',
    media_type: 'image',
    parent_post_id: undefined,
    is_pinned: false,
    is_approved: true,
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T08:00:00Z',
    user: {
      id: 'user-123',
      full_name: 'Usuária Teste',
      avatar_url: 'https://example.com/avatar.jpg'
    },
    reactions_count: {
      like: 5,
      love: 3,
      support: 2,
      pray: 1,
      hug: 0,
      celebrate: 0
    },
    user_reaction: 'like'
  }
];

export const mockGroupPostReactions: GroupPostReaction[] = [
  {
    id: 'reaction-1',
    post_id: 'post-1',
    user_id: 'user-123',
    reaction_type: 'like',
    created_at: '2024-01-15T08:30:00Z',
    user: {
      id: 'user-123',
      full_name: 'Usuária Teste',
      avatar_url: 'https://example.com/avatar.jpg'
    }
  }
];

export const mockGroupInvites: GroupInvite[] = [
  {
    id: 'invite-1',
    group_id: 'group-1',
    invited_user_id: 'user-999',
    invited_by_user_id: 'user-123',
    message: 'Venha fazer parte do nosso grupo!',
    status: 'pending',
    expires_at: '2024-01-20T00:00:00Z',
    created_at: '2024-01-15T00:00:00Z',
    group: {
      id: 'group-1',
      name: 'Mães de Fé',
      description: 'Grupo para mães que querem crescer na fé',
      category: 'Fé',
      is_private: false
    },
    invited_user: {
      id: 'user-999',
      full_name: 'Mãe Convidada',
      avatar_url: 'https://example.com/avatar4.jpg'
    },
    invited_by_user: {
      id: 'user-123',
      full_name: 'Usuária Teste',
      avatar_url: 'https://example.com/avatar.jpg'
    }
  }
];

export const mockGroupNotifications: GroupNotification[] = [
  {
    id: 'notification-1',
    user_id: 'user-123',
    group_id: 'group-1',
    type: 'new_post',
    title: 'Novo post no grupo',
    message: 'Usuária Teste fez um novo post em Mães de Fé',
    data: { post_id: 'post-1' },
    is_read: false,
    created_at: '2024-01-15T08:00:00Z',
    group: {
      id: 'group-1',
      name: 'Mães de Fé',
      description: 'Grupo para mães que querem crescer na fé',
      category: 'Fé',
      is_private: false
    }
  }
];

// =====================================================
// MOCK DO SUPABASE CLIENT
// =====================================================

export const createMockSupabaseClient = () => {
  const mockAuth = {
    getUser: vi.fn().mockResolvedValue({
      data: { user: mockUser },
      error: null
    })
  };

  const mockFrom = vi.fn().mockImplementation(() => {
    const queryBuilder = {
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      like: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      contains: vi.fn().mockReturnThis(),
      containedBy: vi.fn().mockReturnThis(),
      rangeGt: vi.fn().mockReturnThis(),
      rangeGte: vi.fn().mockReturnThis(),
      rangeLt: vi.fn().mockReturnThis(),
      rangeLte: vi.fn().mockReturnThis(),
      rangeAdjacent: vi.fn().mockReturnThis(),
      overlaps: vi.fn().mockReturnThis(),
      textSearch: vi.fn().mockReturnThis(),
      match: vi.fn().mockReturnThis(),
      not: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      filter: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockReturnThis(),
      csv: vi.fn().mockReturnThis(),
      geojson: vi.fn().mockReturnThis(),
      explain: vi.fn().mockReturnThis(),
      rollback: vi.fn().mockReturnThis(),
      returns: vi.fn().mockReturnThis(),
      then: vi.fn().mockReturnThis()
    };
    
    // Adicionar método then para simular Promise
    queryBuilder.then = vi.fn().mockImplementation((callback) => {
      // Por padrão, retorna uma resposta de sucesso vazia
      const response = mockSupabaseResponse([]);
      return callback ? callback(response) : Promise.resolve(response);
    });
    
    return queryBuilder;
  });

  return {
    auth: mockAuth,
    from: mockFrom
  };
};

// =====================================================
// HELPERS PARA TESTES
// =====================================================

export const mockSupabaseResponse = <T>(data: T, error: any = null, count: number | null = null) => ({
  data,
  error,
  count,
  status: 200,
  statusText: 'OK'
});

export const mockSupabaseError = (message: string, code?: string) => ({
  data: null,
  error: {
    message,
    code,
    details: null,
    hint: null
  },
  count: null,
  status: 400,
  statusText: 'Bad Request'
});

// =====================================================
// CONFIGURAÇÃO DE TESTES
// =====================================================

/**
 * Cria um mock do Supabase Client configurado para testes.
 *
 * USO:
 * ```typescript
 * // No arquivo de teste, ANTES de importar o service:
 * vi.mock('../../lib/supabase', () => ({
 *   supabase: createMockSupabaseClient()
 * }));
 *
 * import { groupsService } from '../services/groups.service';
 * ```
 */
export const setupSupabaseMock = () => {
  const mockClient = createMockSupabaseClient();
  return mockClient;
};

// Alias para compatibilidade com testes antigos
export const setupSupabaseMocks = setupSupabaseMock;

export const resetSupabaseMocks = () => {
  vi.clearAllMocks();
};

/**
 * IMPORTANTE: Para usar mocks nos testes, siga este padrão:
 *
 * ```typescript
 * // No TOPO do arquivo de teste, ANTES de qualquer import:
 * vi.mock('./src/lib/supabase', () => {
 *   return {
 *     supabase: {
 *       auth: {
 *         getUser: vi.fn(),
 *         getSession: vi.fn()
 *       },
 *       from: vi.fn()
 *     }
 *   };
 * });
 *
 * // Depois, importe o service e o supabase:
 * import { groupsService } from './src/services/groups.service';
 * import { supabase } from './src/lib/supabase';
 *
 * // Crie referência tipada ao mock:
 * const mockSupabase = vi.mocked(supabase);
 *
 * // No beforeEach, configure o mock de autenticação:
 * beforeEach(() => {
 *   vi.clearAllMocks();
 *   mockSupabase.auth.getUser.mockResolvedValue({
 *     data: { user: mockUser },
 *     error: null
 *   });
 * });
 * ```
 */

// =====================================================
// HELPERS PARA CONFIGURAR RESPOSTAS DE QUERY BUILDERS
// =====================================================

/**
 * Cria um query builder mockado que retorna dados específicos.
 *
 * @example
 * ```typescript
 * const queryBuilder = createMockQueryBuilder(mockGroups);
 * mockSupabase.from.mockReturnValue(queryBuilder);
 * ```
 */
export const createMockQueryBuilder = <T>(
  data: T,
  error: any = null,
  count: number | null = null
) => {
  const builder = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
    containedBy: vi.fn().mockReturnThis(),
    rangeGt: vi.fn().mockReturnThis(),
    rangeGte: vi.fn().mockReturnThis(),
    rangeLt: vi.fn().mockReturnThis(),
    rangeLte: vi.fn().mockReturnThis(),
    rangeAdjacent: vi.fn().mockReturnThis(),
    overlaps: vi.fn().mockReturnThis(),
    textSearch: vi.fn().mockReturnThis(),
    match: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    filter: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis(),
    csv: vi.fn().mockReturnThis(),
    geojson: vi.fn().mockReturnThis(),
    explain: vi.fn().mockReturnThis(),
    rollback: vi.fn().mockReturnThis(),
    returns: vi.fn().mockReturnThis(),
  };

  // Adicionar método then para simular Promise
  // @ts-ignore
  builder.then = vi.fn().mockImplementation((callback) => {
    const response = mockSupabaseResponse(data, error, count);
    return callback ? callback(response) : Promise.resolve(response);
  });

  return builder;
};

/**
 * Cria um mock de autenticação configurado.
 *
 * @example
 * ```typescript
 * const mockAuth = createAuthMock(mockUser);
 * // ou para simular usuário não autenticado:
 * const mockAuth = createAuthMock(null);
 * ```
 */
export const createAuthMock = (user: typeof mockUser | null = mockUser) => {
  return {
    getUser: vi.fn().mockResolvedValue({
      data: { user },
      error: user ? null : { message: 'Not authenticated' }
    }),
    getSession: vi.fn().mockResolvedValue({
      data: {
        session: user ? {
          access_token: 'mock-token',
          user
        } : null
      },
      error: user ? null : { message: 'Not authenticated' }
    })
  };
};
