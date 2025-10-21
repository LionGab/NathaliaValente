import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
