/**
 * Nossa Maternidade - Setup de Testes
 * Configuração global para todos os testes
 */

import { expect, afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Estender expect com matchers do jest-dom
expect.extend(matchers);

// Limpar após cada teste
afterEach(() => {
  cleanup();
});

// Mock do window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock do IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock do ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock do PerformanceObserver with supportedEntryTypes
global.PerformanceObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
})) as unknown as typeof PerformanceObserver;
// @ts-expect-error - Add static property for testing
global.PerformanceObserver.supportedEntryTypes = ['measure', 'navigation', 'resource'];

// Mock do navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true,
});

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock do sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock do fetch
global.fetch = vi.fn();

// Mock do console para evitar logs durante testes
const originalConsole = console;
global.console = {
  ...originalConsole,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Mock do performance
Object.defineProperty(window, 'performance', {
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn(() => []),
    getEntriesByName: vi.fn(() => []),
  },
  writable: true,
});

// Mock do URL
global.URL.createObjectURL = vi.fn(() => 'mocked-url');
global.URL.revokeObjectURL = vi.fn();

// Mock do FileReader
global.FileReader = vi.fn().mockImplementation(() => ({
  readAsDataURL: vi.fn(),
  readAsText: vi.fn(),
  readAsArrayBuffer: vi.fn(),
  result: null,
  error: null,
  readyState: 0,
  onload: null,
  onerror: null,
  onabort: null,
  onloadend: null,
  onloadstart: null,
  onprogress: null,
  abort: vi.fn(),
  readAsBinaryString: vi.fn(),
})) as unknown as typeof FileReader;

// Mock do crypto
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn(() => 'mocked-uuid'),
    getRandomValues: vi.fn((arr) => arr.map(() => Math.floor(Math.random() * 256))),
  },
});

// Mock do MutationObserver
global.MutationObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn(() => []),
}));

// Mock do requestAnimationFrame
global.requestAnimationFrame = vi.fn(
  (cb) => setTimeout(cb, 0) as unknown as number
) as unknown as typeof requestAnimationFrame;
global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));

// Mock do setTimeout e setInterval para testes mais rápidos
vi.useFakeTimers();

// Restaurar timers após cada teste
afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  vi.useFakeTimers();
});

// Configurações globais de teste
beforeEach(() => {
  // Limpar todos os mocks antes de cada teste
  vi.clearAllMocks();

  // Resetar localStorage e sessionStorage
  localStorageMock.clear();
  sessionStorageMock.clear();

  // Resetar fetch
  vi.mocked(fetch).mockClear();

  // Resetar console
  vi.mocked(console.log).mockClear();
  vi.mocked(console.error).mockClear();
  vi.mocked(console.warn).mockClear();
});

// Configurações de timeout para testes
vi.setConfig({
  testTimeout: 10000,
  hookTimeout: 10000,
});

// Exportar configurações para uso em testes
export const testConfig = {
  mockData: {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      fullName: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
    },
    group: {
      id: 'test-group-id',
      name: 'Test Group',
      description: 'Test Description',
      category: 'amamentacao',
      isPrivate: false,
    },
    post: {
      id: 'test-post-id',
      content: 'Test post content',
      userId: 'test-user-id',
      groupId: 'test-group-id',
      createdAt: new Date().toISOString(),
    },
  },
  mockFunctions: {
    mockSupabase: {
      auth: {
        signInWithPassword: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        getUser: vi.fn(),
        onAuthStateChange: vi.fn(),
      },
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
      })),
    },
  },
};
