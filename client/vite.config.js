import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    open: true,
    proxy: {
      '/api': {
        // target: 'http://localhost:3001',
        target: 'https://whip-in-time-server.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
