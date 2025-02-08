import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        main: (resolve(__dirname, 'public', 'index.html'))
      }
    },
    sourcemap: true
  }
});
