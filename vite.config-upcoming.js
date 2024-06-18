import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import copyAssets from './vite-plugin-copy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    //copyAssets()
  ],
  base: '', // base path was originally not set. Another option is /feed/dist/
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash].[ext]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
});
