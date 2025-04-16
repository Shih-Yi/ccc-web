import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'

export default defineConfig(({ mode }) => ({
  plugins: [
    adonisjs({
      /**
       * Entrypoints of your application. Each entrypoint will
       * result in a separate bundle.
       */
      entrypoints: ['resources/js/app.js'],

      /**
       * Paths to watch and reload the browser on file change
       */
      reload: ['resources/views/**/*.edge'],
    }),
  ],
  // add css sourcemap
  css: {
    devSourcemap: true,
  },
  build: {
    manifest: true,
    outDir: 'public/assets',
    rollupOptions: {
      input: {
        app: 'resources/js/app.js',
      },
    },
    assetsInlineLimit: 0, // 確保所有資源都被複製而不是內聯
  },
  publicDir: 'public',
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
}))
