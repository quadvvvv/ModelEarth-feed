import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    renameHtml() // Add the plugin here
  ],
  base: '', // Otherwise '/assets' is the default
  build: {
    rollupOptions: {
      input: "./feedplayer.html",
      output: {
        //assetFileNames: 'assets/[name]-[hash].[ext]',
        //chunkFileNames: 'assets/[name]-[hash].js',
        //entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames: 'assets/[name].js',
        entryFileNames: 'assets/[name].js',
      },
    },
  },
});

function renameHtml() {
  return {
    name: 'rename-html',
    writeBundle() {
      const oldPath = path.resolve(__dirname, 'dist/feedplayer.html');
      const newPath = path.resolve(__dirname, 'dist/index.html');

      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
      }
    },
  };
}
