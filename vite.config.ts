import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Battle.net OAuth (token endpoint)
      '/oauth': {
        target: 'https://oauth.battle.net',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/oauth/, ''),
      },
      // Game-Data API
      '/blizzard': {
        target: 'https://eu.api.blizzard.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/blizzard/, ''),
      },
    },
  },
});
