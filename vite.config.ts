import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  },
  build: {
    // Enable source maps for debugging (disable in production if needed)
    sourcemap: false,
    // Target modern browsers for smaller bundle
    target: 'es2020',
    // Chunk size warning threshold
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React ecosystem
          if (id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }
          // UI icons - large dependency
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          // Supabase client
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase';
          }
          // Sentry monitoring
          if (id.includes('node_modules/@sentry')) {
            return 'vendor-sentry';
          }
          // Google AI SDK
          if (id.includes('node_modules/@google')) {
            return 'vendor-google';
          }
        },
        // Optimize asset file names
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      }
    },
    // Minification settings
    minify: 'esbuild',
  },
  plugins: [
    react(),
    // Bundle analyzer - generates stats.html after build
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
  },
});
