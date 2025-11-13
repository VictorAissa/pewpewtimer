import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: [
                'favicon.ico',
                'robots.txt',
                'apple-touch-icon.png',
            ],
            manifest: {
                name: 'Pew Pew Timer',
                short_name: 'PewPewTimer',
                description:
                    'Training shot timer for part time and shots detection',
                theme_color: '#96897b',
                background_color: '#6b7280',
                display: 'standalone',
                orientation: 'portrait',
                scope: '/',
                start_url: '/',
                icons: [
                    {
                        src: '64.png',
                        sizes: '64x64',
                        type: 'image/png',
                    },
                    {
                        src: 'android-launchericon-192-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'android-launchericon-512-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: 'maskable-android-launchericon-512-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
            },
        }),
    ],
});
