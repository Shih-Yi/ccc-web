import app from '@adonisjs/core/services/app'
import { defineConfig, formatters, loaders } from '@adonisjs/i18n'
import { join } from 'node:path'

/**
 * 根據環境決定語言文件路徑
 */
function getLangFilesPath() {
  const path = app.inProduction
    ? join(process.cwd(), 'current/resources/lang')
    : app.languageFilesPath()

  console.log(`[i18n] Using language path: ${path}`)
  console.log(`[i18n] App in production: ${app.inProduction}`)

  return path
}

export default defineConfig({
  defaultLocale: 'en',
  supportedLocales: ['en', 'zh-TW', 'zh-CN'],
  formatter: formatters.icu(),

  loaders: [
    loaders.fs({
      location: getLangFilesPath(),
    }),
  ],
})
