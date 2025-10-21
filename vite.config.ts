import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // PWA Plugin
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'ClubNath - Comunidade de Mulheres',
        short_name: 'ClubNath',
        description: 'Seu espaço de conexão, fé e bem-estar. Comunidade de mulheres se apoiando mutuamente.',
        theme_color: '#E77A5C',
        background_color: '#FFFBF7',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        categories: ['lifestyle', 'social', 'health'],
        lang: 'pt-BR',
        dir: 'ltr',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        screenshots: [
          {
            src: '/screenshot1.png',
            sizes: '1170x2532',
            type: 'image/png',
            form_factor: 'narrow',
          },
        ],
      },
      workbox: {
        // Cache strategies
        runtimeCaching: [
          // Images
          {
            urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          // Supabase API
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 minutes
              },
            },
          },
          // Google Fonts
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
        // Clean up old caches
        cleanupOutdatedCaches: true,
        // Skip waiting
        skipWaiting: true,
        clientsClaim: true,
      },
      devOptions: {
        enabled: false, // Disable PWA in dev mode
      },
    }),
    // Gzip compression
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240, // Only compress files > 10KB
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Brotli compression (better than gzip, ~20% smaller)
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'brotliCompress',
      ext: '.br',
      compressionOptions: {
        level: 11, // Maximum compression
      },
    }),
  ],

  // Build optimizations
  build: {
    // Target modern browsers for smaller bundles
    target: 'es2020',

    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'], // Remove specific console methods
      },
      format: {
        comments: false, // Remove all comments
      },
    },

    // Source maps only for errors (smaller builds)
    sourcemap: false,

    // Chunk size warnings
    chunkSizeWarningLimit: 1000, // Warn if chunk > 1MB

    // Manual code splitting for better caching
    rollupOptions: {
      output: {
        // Separate vendor code
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom'],

          // UI library
          'vendor-ui': ['lucide-react'],

          // Supabase
          'vendor-supabase': ['@supabase/supabase-js'],
        },

        // Optimize chunk names for better caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },

    // CSS code splitting
    cssCodeSplit: true,

    // Optimize CSS
    cssMinify: true,

    // Report compressed size
    reportCompressedSize: true,

    // Increase chunk size limit before warning
    assetsInlineLimit: 4096, // Inline assets < 4KB as base64
  },

  // Dependency optimization
  optimizeDeps: {
    // Exclude large libraries from pre-bundling
    exclude: ['lucide-react'],

    // Include dependencies that should be pre-bundled
    include: ['react', 'react-dom', '@supabase/supabase-js'],
  },

  // Server configuration (for dev)
  server: {
    // Enable compression in dev mode
    cors: true,

    // Optimize HMR
    hmr: {
      overlay: true,
    },
  },
});
