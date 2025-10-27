// =====================================================
// MOCK COMPLETO DO SUPABASE PARA TESTES
// =====================================================

import { vi } from 'vitest';

// =====================================================
// TIPOS E INTERFACES
// =====================================================

export interface MockSupabaseResponse<T = any> {
  data: T | null;
  error: any;
  count?: number | null;
  status: number;
  statusText: string;
}

export interface MockUser {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface MockQueryBuilder {
  select: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  neq: ReturnType<typeof vi.fn>;
  gt: ReturnType<typeof vi.fn>;
  gte: ReturnType<typeof vi.fn>;
  lt: ReturnType<typeof vi.fn>;
  lte: ReturnType<typeof vi.fn>;
  like: ReturnType<typeof vi.fn>;
  ilike: ReturnType<typeof vi.fn>;
  is: ReturnType<typeof vi.fn>;
  in: ReturnType<typeof vi.fn>;
  contains: ReturnType<typeof vi.fn>;
  containedBy: ReturnType<typeof vi.fn>;
  rangeGt: ReturnType<typeof vi.fn>;
  rangeGte: ReturnType<typeof vi.fn>;
  rangeLt: ReturnType<typeof vi.fn>;
  rangeLte: ReturnType<typeof vi.fn>;
  rangeAdjacent: ReturnType<typeof vi.fn>;
  overlaps: ReturnType<typeof vi.fn>;
  textSearch: ReturnType<typeof vi.fn>;
  match: ReturnType<typeof vi.fn>;
  not: ReturnType<typeof vi.fn>;
  or: ReturnType<typeof vi.fn>;
  filter: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  range: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  maybeSingle: ReturnType<typeof vi.fn>;
  csv: ReturnType<typeof vi.fn>;
  geojson: ReturnType<typeof vi.fn>;
  explain: ReturnType<typeof vi.fn>;
  rollback: ReturnType<typeof vi.fn>;
  returns: ReturnType<typeof vi.fn>;
  then: ReturnType<typeof vi.fn>;
}

export interface MockSupabaseClient {
  auth: {
    getUser: ReturnType<typeof vi.fn>;
    signInWithPassword: ReturnType<typeof vi.fn>;
    signUp: ReturnType<typeof vi.fn>;
    signOut: ReturnType<typeof vi.fn>;
  };
  from: ReturnType<typeof vi.fn>;
}

// =====================================================
// DADOS MOCK PADRÃO
// =====================================================

export const mockAuthUser: MockUser = {
  id: 'user-123',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Usuária Teste',
    avatar_url: 'https://example.com/avatar.jpg'
  }
};

export const mockGroups = [
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
    }
  },
  {
    id: 'group-2',
    name: 'Mães Trabalhadoras',
    description: 'Grupo para mães que trabalham fora',
    category: 'Carreira',
    creator_id: 'user-456',
    is_private: false,
    max_members: 30,
    current_members: 15,
    cover_image_url: 'https://example.com/cover2.jpg',
    rules: 'Respeite o horário de trabalho',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    creator: {
      id: 'user-456',
      full_name: 'Mãe Trabalhadora',
      avatar_url: 'https://example.com/avatar2.jpg'
    }
  }
];

export const mockGroupMembers = [
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

// =====================================================
// HELPERS PARA RESPOSTAS
// =====================================================

export const mockQuerySuccess = <T>(data: T, count?: number): MockSupabaseResponse<T> => ({
  data,
  error: null,
  count: count ?? null,
  status: 200,
  statusText: 'OK'
});

export const mockQueryError = (message: string, code?: string): MockSupabaseResponse => ({
  data: null,
  error: {
    message,
    code: code ?? 'PGRST_ERROR',
    details: null,
    hint: null
  },
  count: null,
  status: 400,
  statusText: 'Bad Request'
});

export const mockAuthSuccess = (user: MockUser = mockAuthUser) => ({
  data: { user },
  error: null
});

export const mockAuthError = (message: string = 'Usuário não autenticado') => ({
  data: { user: null },
  error: { message }
});

// =====================================================
// CRIADOR DE QUERY BUILDER
// =====================================================

export const createMockQueryBuilder = (response: MockSupabaseResponse): MockQueryBuilder => {
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
    then: vi.fn().mockImplementation((callback) => {
      if (callback) {
        return callback(response);
      }
      return Promise.resolve(response);
    })
  };
  return queryBuilder;
};

// =====================================================
// CLIENTE SUPABASE MOCKADO
// =====================================================

export const createMockSupabaseClient = (): MockSupabaseClient => {
  const mockClient: MockSupabaseClient = {
    auth: {
      getUser: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn()
    },
    from: vi.fn()
  };

  // Configurar mocks padrão
  mockClient.auth.getUser.mockResolvedValue(mockAuthSuccess());
  mockClient.auth.signInWithPassword.mockResolvedValue(mockAuthSuccess());
  mockClient.auth.signUp.mockResolvedValue(mockAuthSuccess());
  mockClient.auth.signOut.mockResolvedValue({ error: null });

  // Mock da função from com respostas padrão
  mockClient.from.mockImplementation((table: string) => {
    switch (table) {
      case 'groups':
        return createMockQueryBuilder(mockQuerySuccess(mockGroups));
      case 'group_members':
        return createMockQueryBuilder(mockQuerySuccess(mockGroupMembers));
      case 'group_posts':
        return createMockQueryBuilder(mockQuerySuccess([]));
      case 'group_invites':
        return createMockQueryBuilder(mockQuerySuccess([]));
      case 'group_notifications':
        return createMockQueryBuilder(mockQuerySuccess([]));
      default:
        return createMockQueryBuilder(mockQuerySuccess([]));
    }
  });

  return mockClient;
};

// =====================================================
// INSTÂNCIA GLOBAL DO MOCK
// =====================================================

export const mockSupabaseClient = createMockSupabaseClient();

// =====================================================
// FUNÇÕES DE CONFIGURAÇÃO
// =====================================================

export const resetMocks = () => {
  vi.clearAllMocks();
  
  // Resetar para valores padrão
  mockSupabaseClient.auth.getUser.mockResolvedValue(mockAuthSuccess());
  mockSupabaseClient.auth.signInWithPassword.mockResolvedValue(mockAuthSuccess());
  mockSupabaseClient.auth.signUp.mockResolvedValue(mockAuthSuccess());
  mockSupabaseClient.auth.signOut.mockResolvedValue({ error: null });

  // Resetar função from
  mockSupabaseClient.from.mockImplementation((table: string) => {
    switch (table) {
      case 'groups':
        return createMockQueryBuilder(mockQuerySuccess(mockGroups));
      case 'group_members':
        return createMockQueryBuilder(mockQuerySuccess(mockGroupMembers));
      case 'group_posts':
        return createMockQueryBuilder(mockQuerySuccess([]));
      case 'group_invites':
        return createMockQueryBuilder(mockQuerySuccess([]));
      case 'group_notifications':
        return createMockQueryBuilder(mockQuerySuccess([]));
      default:
        return createMockQueryBuilder(mockQuerySuccess([]));
    }
  });
};

export const mockAuthUserCustom = (user: MockUser) => {
  mockSupabaseClient.auth.getUser.mockResolvedValue(mockAuthSuccess(user));
};

export const mockAuthErrorCustom = (message: string) => {
  mockSupabaseClient.auth.getUser.mockResolvedValue({
    data: { user: null },
    error: { message }
  });
};

export const mockQueryResponse = (table: string, response: MockSupabaseResponse) => {
  mockSupabaseClient.from.mockImplementation((tableName: string) => {
    if (tableName === table) {
      return createMockQueryBuilder(response);
    }
    // Para outras tabelas, usar implementação padrão
    return createMockQueryBuilder(mockQuerySuccess([]));
  });
};

export const mockQueryErrorCustom = (table: string, message: string, code?: string) => {
  mockQueryResponse(table, mockQueryError(message, code));
};

// =====================================================
// MOCK DO MÓDULO SUPABASE
// =====================================================

export const setupSupabaseMock = () => {
  vi.mock('../../src/lib/supabase', () => ({
    supabase: mockSupabaseClient
  }));
  
  return mockSupabaseClient;
};

// =====================================================
// HELPERS ESPECÍFICOS PARA GRUPOS
// =====================================================

export const mockGroupsSuccess = (groups = mockGroups) => {
  mockQueryResponse('groups', mockQuerySuccess(groups));
};

export const mockGroupsError = (message: string) => {
  mockQueryError('groups', message);
};

export const mockGroupMembersSuccess = (members = mockGroupMembers) => {
  mockQueryResponse('group_members', mockQuerySuccess(members));
};

export const mockGroupMembersError = (message: string) => {
  mockQueryError('group_members', message);
};

export const mockCreateGroupSuccess = (group: any) => {
  mockQueryResponse('groups', mockQuerySuccess(group));
};

export const mockCreateGroupError = (message: string) => {
  mockQueryError('groups', message);
};

export const mockUpdateGroupSuccess = (group: any) => {
  mockQueryResponse('groups', mockQuerySuccess(group));
};

export const mockUpdateGroupError = (message: string) => {
  mockQueryError('groups', message);
};

export const mockDeleteGroupSuccess = () => {
  mockQueryResponse('groups', mockQuerySuccess({}));
};

export const mockDeleteGroupError = (message: string) => {
  mockQueryError('groups', message);
};

// =====================================================
// EXPORTS PRINCIPAIS
// =====================================================

export {
  mockSupabaseClient as default
};
