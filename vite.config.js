import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  server: {
    // Forwards /api/* to api-server.js (run separately: `npm run dev:api`)
    // so `npm run dev` keeps Vite's HMR while still talking to the real
    // Postgres-backed API. Vercel needs no equivalent config in
    // production — it routes /api/*.js itself.
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'FORMO Maldives',
        short_name: 'FORMO',
        description: 'Find certified personal trainers and book sessions anywhere in the Maldives.',
        theme_color: '#0e1715',
        background_color: '#0e1715',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
