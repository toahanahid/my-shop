import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',  // your global CSS
                'resources/js/app.jsx',   // React entry
            ],
            refresh: true,  // enables automatic page reload on Blade/PHP changes
        }),
        react(),  // enables React fast refresh
    ],

    server: {
        host: '127.0.0.1',   // or 'localhost'
        port: 5173,          // Vite dev server port
        strictPort: false,   // allows fallback to next port if busy
    },

    build: {
        outDir: 'public/build', // compiled assets location
        manifest: true,
        rollupOptions: {
            input: 'resources/js/app.jsx',
        },
    },

    resolve: {
        alias: {
            '@': '/resources/js', // optional shortcut for imports
        },
    },
});
