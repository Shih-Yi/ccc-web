import app from '@adonisjs/core/services/app'
import { defineConfig, formatters, loaders } from '@adonisjs/i18n'

export default defineConfig({
  defaultLocale: 'en',
  supportedLocales: ['en', 'zh-TW', 'zh-CN'],
  formatter: formatters.icu(),

  loaders: [
    loaders.fs({
      location: app.languageFilesPath(),
    }),
  ],
})
