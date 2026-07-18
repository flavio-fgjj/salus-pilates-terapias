import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwind(),
    VitePWA({
      // The site is a single SPA, so the manifest link and SW registration are
      // only wired up manually inside AdminLayout while under /admin — the
      // public marketing pages never advertise an install prompt.
      injectRegister: null,
      manifestFilename: 'admin-manifest.webmanifest',
      scope: '/admin/',
      manifest: {
        name: 'Salus Pilates e Terapias - Admin',
        short_name: 'Salus Admin',
        description: 'Painel administrativo do Salus Pilates e Terapias',
        start_url: '/admin',
        scope: '/admin/',
        display: 'standalone',
        background_color: '#1C1C1C',
        theme_color: '#00A36C',
        icons: [
          { src: '/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Only serve the offline SPA shell for admin routes — the marketing
        // pages are never intercepted by the service worker.
        navigateFallbackAllowlist: [/^\/admin/],
      },
    }),
  ],
})
