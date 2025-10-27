import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/test/**',
        '!src/**/*.test.{ts,tsx}',
        '!src/**/*.spec.{ts,tsx}',
        '!src/main.tsx',
        '!src/vite-env.d.ts'
      ],
      exclude: [
        'node_modules/**',
        'dist/**',
        'coverage/**',
        'tests/**',
        '**/*.config.{js,ts}',
        '**/*.config.*.{js,ts}'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        },
        // Configurações específicas por diretório
        'src/lib/': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        },
        'src/hooks/': {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85
        },
        'src/components/': {
          branches: 75,
          functions: 75,
          lines: 75,
          statements: 75
        }
      },
      // Configurações de cobertura
      all: true,
      skipFull: false,
      clean: true,
      cleanOnRerun: true
    },
    // Configurações de teste
    include: [
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'tests/**/*.{test,spec}.{js,ts,jsx,tsx}'
    ],
    exclude: [
      'node_modules/**',
      'dist/**',
      'coverage/**'
    ],
    // Timeout para testes
    testTimeout: 10000,
    hookTimeout: 10000,
    // Configurações de paralelização
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false
      }
    },
    // Configurações de mock
    mockReset: true,
    restoreMocks: true,
    clearMocks: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@features': path.resolve(__dirname, './src/features')
    }
  }
});