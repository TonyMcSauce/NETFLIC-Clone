import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000',
      '/media': 'http://localhost:4000',
      '/thumbnails': 'http://localhost:4000',
      '/subtitles': 'http://localhost:4000'
    }
  }
});
