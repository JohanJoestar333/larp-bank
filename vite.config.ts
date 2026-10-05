import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
        workbox: {
          // By default the service worker answers EVERY navigation that isn't precached with
          // index.html (the SPA shell). Tapping a download link such as /icons/bank.png counts
          // as a navigation, so the phone saved index.html under a .png name ("the downloads
          // are HTML"). Never apply the SPA fallback to real files: icons, images, logos, or
          // any path that ends in a file extension. App routes (/bank, /shopify, ...) have none.
          navigateFallbackDenylist: [
            /^\/icons\//,
            /^\/images\//,
            /^\/logos\//,
            /^[^?#]*\.[a-z0-9]{2,5}(\?.*)?$/i, // any path ending in a file extension
          ],
        },
        manifest: {
          id: '/',
          name: 'PropStudio: Fictional Dashboards',
          short_name: 'PropStudio',
          description: 'Fictional dashboard prop simulator for filming and investment series.',
          theme_color: '#090d16',
          background_color: '#090d16',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
