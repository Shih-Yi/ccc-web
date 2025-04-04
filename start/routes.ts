/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import i18nManager from '@adonisjs/i18n/services/main'

const HomeController = () => import('#controllers/home_controller')
const PagesController = () => import('#controllers/pages_controller')

// Public routes (no authentication required)
router.get('/', [HomeController, 'index']).as('home')

router.get('pages/:slug', [PagesController, 'show']).as('pages.show')

// Language switcher
router
  .get('/language/:locale', async ({ params, response, i18n, session }) => {
    const { locale } = params
    const supportedLocales = i18nManager.supportedLocales()

    if (supportedLocales.includes(locale)) {
      await i18n.switchLocale(locale)
      session.put('locale', locale)
    }
    return response.redirect().back()
  })
  .as('language')
