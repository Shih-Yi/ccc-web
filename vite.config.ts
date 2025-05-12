import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'

export default defineConfig({
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
      reload: ['resources/views/**/*.edge', 'resources/lang/**/*.json'],
    }),
  ],
  // add css sourcemap
  css: {
    devSourcemap: true,
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    manifest: true,
    outDir: 'public/assets',
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || []
          const ext = info.length > 0 ? info[info.length - 1] : ''

          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `img/[name]-[hash][extname]`
          }

          if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
            return `fonts/[name]-[hash][extname]`
          }

          return `[name]-[hash][extname]`
        },
      },
    },
  },
  assetsInclude: [
    '**/*.svg',
    '**/*.png',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.gif',
    '**/*.woff',
    '**/*.woff2',
    '**/*.ttf',
  ],
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  optimizeDeps: {
    include: ['jquery', 'bootstrap', '@popperjs/core'],
  },
})
