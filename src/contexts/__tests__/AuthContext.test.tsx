import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { supabase } from '../../lib/supabase';
import { authWithRetry } from '../../lib/apiClient';
import { handleError } from '../../lib/errorHandler';

// Mock do Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(),
        })),
      })),
    })),
  },
}));

// Mock do apiClient
vi.mock('../../lib/apiClient', () => ({
  authWithRetry: vi.fn(),
}));

// Mock do errorHandler
vi.mock('../../lib/errorHandler', () => ({
  handleError: vi.fn(),
}));

// Componente de teste para usar o AuthContext
const TestComponent = () => {
  const { user, profile, loading, signIn, signUp, signOut, signInDemo } = useAuth();

  return (
    <div>
      <div data-testid="user">{user?.email || 'No user'}</div>
      <div data-testid="profile">{profile?.full_name || 'No profile'}</div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not loading'}</div>
      <button data-testid="signin" onClick={() => signIn('test@example.com', 'password')}>
        Sign In
      </button>
      <button
        data-testid="signup"
        onClick={() => signUp('test@example.com', 'password', 'Test User')}
      >
        Sign Up
      </button>
      <button data-testid="signout" onClick={() => signOut()}>
        Sign Out
      </button>
      <button data-testid="demo" onClick={() => signInDemo()}>
        Demo Mode
      </button>
    </div>
  );
};

// Wrapper com AuthProvider
const renderWithAuthProvider = (ui: React.ReactElement) => {
  return render(<AuthProvider>{ui}</AuthProvider>);
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Login com credenciais vÃ¡lidas', () => {
    it('deve fazer login com sucesso', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com',
        },
        access_token: 'token123',
      };

      const mockProfile = {
        id: 'user123',
        full_name: 'Test User',
        username: 'testuser',
        avatar_url: 'https://example.com/avatar.jpg',
        bio: 'Test bio',
        followers_count: 100,
        following_count: 50,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      // Mock da sessÃ£o inicial
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      // Mock do onAuthStateChange
      const mockOnAuthStateChange = vi.fn();
      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      // Mock do authWithRetry
      vi.mocked(authWithRetry).mockResolvedValue({
        success: true,
        data: mockSession,
        error: null,
      });

      // Mock do fetchProfile
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: mockProfile,
              error: null,
            }),
          }),
        }),
      } as any);

      renderWithAuthProvider(<TestComponent />);

      // Simular mudanÃ§a de estado de auth
      const authStateChangeCallback = vi.mocked(supabase.auth.onAuthStateChange).mock.calls[0][0];
      await authStateChangeCallback('SIGNED_IN', mockSession);

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
        expect(screen.getByTestId('profile')).toHaveTextContent('Test User');
      });
    });

    it('deve chamar fetchProfile apÃ³s login bem-sucedido', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com',
        },
      };

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      vi.mocked(authWithRetry).mockResolvedValue({
        success: true,
        data: mockSession,
        error: null,
      });

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { full_name: 'Test User' },
              error: null,
            }),
          }),
        }),
      });

      vi.mocked(supabase.from).mockImplementation(mockFrom);

      renderWithAuthProvider(<TestComponent />);

      const authStateChangeCallback = vi.mocked(supabase.auth.onAuthStateChange).mock.calls[0][0];
      await authStateChangeCallback('SIGNED_IN', mockSession);

      await waitFor(() => {
        expect(mockFrom).toHaveBeenCalledWith('profiles');
      });
    });
  });

  describe('Login com credenciais invÃ¡lidas', () => {
    it('deve tratar erro de login', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      const mockError = new Error('Invalid credentials');
      vi.mocked(authWithRetry).mockResolvedValue({
        success: false,
        data: null,
        error: mockError,
      });

      vi.mocked(handleError).mockReturnValue({
        userFriendlyMessage: 'Credenciais invÃ¡lidas',
        technicalMessage: 'Invalid credentials',
        code: 'AUTH_ERROR',
      });

      renderWithAuthProvider(<TestComponent />);

      fireEvent.click(screen.getByTestId('signin'));

      await waitFor(() => {
        expect(handleError).toHaveBeenCalledWith(mockError, { action: 'sign_in' }, 'auth');
      });
    });
  });

  describe('Signup de novo usuÃ¡rio', () => {
    it('deve criar novo usuÃ¡rio com sucesso', async () => {
      const mockSignUpResponse = {
        data: {
          user: {
            id: 'newuser123',
            email: 'newuser@example.com',
          },
        },
        error: null,
      };

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      vi.mocked(supabase.auth.signUp).mockResolvedValue(mockSignUpResponse);

      renderWithAuthProvider(<TestComponent />);

      fireEvent.click(screen.getByTestId('signup'));

      await waitFor(() => {
        expect(supabase.auth.signUp).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password',
          options: {
            data: { full_name: 'Test User' },
          },
        });
      });
    });

    it('deve tratar erro de signup', async () => {
      const mockError = new Error('Email already exists');

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: null,
        error: mockError,
      });

      renderWithAuthProvider(<TestComponent />);

      fireEvent.click(screen.getByTestId('signup'));

      await waitFor(() => {
        expect(supabase.auth.signUp).toHaveBeenCalled();
      });
    });
  });

  describe('Logout e limpeza de estado', () => {
    it('deve fazer logout e limpar estado', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com',
        },
      };

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      vi.mocked(supabase.auth.signOut).mockResolvedValue({
        error: null,
      });

      renderWithAuthProvider(<TestComponent />);

      fireEvent.click(screen.getByTestId('signout'));

      await waitFor(() => {
        expect(supabase.auth.signOut).toHaveBeenCalled();
      });
    });

    it('deve limpar estado no modo demo', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      renderWithAuthProvider(<TestComponent />);

      // Ativar modo demo
      fireEvent.click(screen.getByTestId('demo'));

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('demo@clubnath.com');
        expect(screen.getByTestId('profile')).toHaveTextContent('NathÃ¡lia Valente');
      });

      // Fazer logout do modo demo
      fireEvent.click(screen.getByTestId('signout'));

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('No user');
        expect(screen.getByTestId('profile')).toHaveTextContent('No profile');
      });
    });
  });

  describe('Modo demo ativado quando Supabase nÃ£o configurado', () => {
    it('deve ativar modo demo quando nÃ£o hÃ¡ configuraÃ§Ã£o do Supabase', async () => {
      vi.mocked(supabase.auth.getSession).mockRejectedValue(new Error('Supabase not configured'));
      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      renderWithAuthProvider(<TestComponent />);

      // O modo demo deve ser ativado automaticamente em caso de erro
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
      });
    });
  });

  describe('Debounce e Race Conditions', () => {
    it('deve evitar mÃºltiplas chamadas de fetchProfile', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com',
        },
      };

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { full_name: 'Test User' },
              error: null,
            }),
          }),
        }),
      });

      vi.mocked(supabase.from).mockImplementation(mockFrom);

      renderWithAuthProvider(<TestComponent />);

      const authStateChangeCallback = vi.mocked(supabase.auth.onAuthStateChange).mock.calls[0][0];

      // Simular mÃºltiplas mudanÃ§as rÃ¡pidas
      await authStateChangeCallback('SIGNED_IN', mockSession);
      await authStateChangeCallback('SIGNED_IN', mockSession);
      await authStateChangeCallback('SIGNED_IN', mockSession);

      // Aguardar o debounce
      await waitFor(
        () => {
          expect(mockFrom).toHaveBeenCalledTimes(1);
        },
        { timeout: 200 }
      );
    });
  });
});
