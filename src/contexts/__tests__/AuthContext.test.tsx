import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import type { ReactNode } from 'react';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() =>
        Promise.resolve({
          data: {
            session: null,
          },
        })
      ),
      onAuthStateChange: vi.fn(() => ({
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      })),
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(() => Promise.resolve({ data: null })),
        })),
      })),
    })),
  },
  Profile: {},
}));

// Mock other dependencies
vi.mock('../../lib/apiClient', () => ({
  authWithRetry: vi.fn(),
}));

vi.mock('../../lib/errorHandler', () => ({
  handleError: vi.fn(),
}));

/**
 * Wrapper component for testing hooks that require AuthProvider
 */
const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within AuthProvider');

      consoleSpy.mockRestore();
    });

    it('should provide auth context when used within AuthProvider', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('profile');
      expect(result.current).toHaveProperty('session');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('isDemoMode');
      expect(result.current).toHaveProperty('signUp');
      expect(result.current).toHaveProperty('signIn');
      expect(result.current).toHaveProperty('signInDemo');
      expect(result.current).toHaveProperty('signOut');
      expect(result.current).toHaveProperty('refreshProfile');
    });
  });

  describe('Initial state', () => {
    it('should start with loading=true', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.loading).toBe(true);
    });

    it('should start with user=null', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toBeNull();
    });

    it('should start with profile=null', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.profile).toBeNull();
    });

    it('should start with session=null', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.session).toBeNull();
    });

    it('should start with isDemoMode=false', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isDemoMode).toBe(false);
    });
  });

  describe('Loading state', () => {
    it('should set loading=false after initial session check', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Initially loading
      expect(result.current.loading).toBe(true);

      // Wait for session check to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Methods', () => {
    it('should have signUp method', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.signUp).toBe('function');
    });

    it('should have signIn method', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.signIn).toBe('function');
    });

    it('should have signInDemo method', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.signInDemo).toBe('function');
    });

    it('should have signOut method', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.signOut).toBe('function');
    });

    it('should have refreshProfile method', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.refreshProfile).toBe('function');
    });
  });

  describe('Type safety', () => {
    it('should have correct TypeScript types', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // These assertions help verify TypeScript types at runtime
      const authContext = result.current;

      // Check that properties have correct types
      expect(authContext.user === null || typeof authContext.user === 'object').toBe(true);
      expect(authContext.profile === null || typeof authContext.profile === 'object').toBe(true);
      expect(authContext.session === null || typeof authContext.session === 'object').toBe(true);
      expect(typeof authContext.loading).toBe('boolean');
      expect(typeof authContext.isDemoMode).toBe('boolean');
    });
  });

  describe('Context Provider', () => {
    it('should render children', () => {
      const testChild = <div data-testid="test-child">Test</div>;
      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <AuthProvider>
            {children}
            {testChild}
          </AuthProvider>
        ),
      });

      expect(result.current).toBeDefined();
    });
  });
});
