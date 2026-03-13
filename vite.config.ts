import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['bakery_door_bag.png'],
      manifest: {
        name: 'Pão à Porta',
        short_name: 'Pão à Porta',
        description: 'Pão fresco entregue na sua porta todas as manhãs.',
        theme_color: '#FDFBF7',
        background_color: '#FDFBF7',
        display: 'standalone',
        icons: [
          {
            src: 'bakery_door_bag.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'bakery_door_bag.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
