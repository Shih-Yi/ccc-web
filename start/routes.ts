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
const AdminDashboardController = () => import('#controllers/admin/dashboard_controller')
const AdminPagesController = () => import('#controllers/admin/pages_controller')
const AdminAuthController = () => import('#controllers/admin/auth_controller')
const PagesController = () => import('#controllers/pages_controller')
const UploadsController = () => import('#controllers/admin/uploads_controller')

// Public routes (no authentication required)
router.get('/', [HomeController, 'index']).as('home')
// Language switcher
router
  .get('/language/:locale', async ({ params, response, i18n, session }) => {
    const { locale } = params
    const supportedLocales = i18nManager.supportedLocales()

    console.log('[Language Route] Switching to locale:', locale)
    console.log('[Language Route] Current locale before switch:', i18n.locale)

    if (supportedLocales.includes(locale)) {
      // 切换语言
      await i18n.switchLocale(locale)
      console.log('[Language Route] After switchLocale, locale is:', i18n.locale)

      // 保存到会话
      session.put('locale', locale)
      console.log('[Language Route] Saved locale to session:', locale)

      // 为确保会话被保存，添加一个提交步骤
      try {
        await session.commit()
        console.log('[Language Route] Session committed successfully')
      } catch (error) {
        console.error('[Language Route] Session commit error:', error)
      }

      // 添加一个备份 Cookie
      response.cookie('user_locale', locale, {
        httpOnly: true,
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 天
        secure: process.env.NODE_ENV === 'production',
      })
      console.log('[Language Route] Set backup cookie')

      // 验证翻译是否工作
      try {
        const testTranslation = i18n.t('admin.nav.welcome')
        console.log('[Language Route] Test translation after switch:', testTranslation)
      } catch (error) {
        console.error('[Language Route] Translation error:', error.message)
      }
    } else {
      console.log('[Language Route] Unsupported locale:', locale)
    }

    console.log('[Language Route] Final locale:', i18n.locale)
    return response.redirect().back()
  })
  .as('language')

// Admin authentication routes (for login)
router
  .group(() => {
    router.get('/admin/login', [AdminAuthController, 'show']).as('admin.auth.login')
    router
      .post('/admin/login', [AdminAuthController, 'login'])
      .as('admin.auth.login.store')
      .middleware([middleware.rateLimit()])
  })
  .middleware([middleware.guest()])

// Admin logout route (needs auth middleware)
router
  .post('/admin/logout', [AdminAuthController, 'logout'])
  .as('admin.auth.logout')
  .middleware([middleware.auth({ guards: ['admin'] })])

// Admin protected routes
router
  .group(() => {
    // Admin dashboard
    router.get('/', [AdminDashboardController, 'dashboard']).as('admin.dashboard')

    // Admin pages management
    router.get('/pages', [AdminPagesController, 'index']).as('admin.pages.index')
    router.get('/pages/create', [AdminPagesController, 'create']).as('admin.pages.create')
    router.post('/pages', [AdminPagesController, 'store']).as('admin.pages.store')
    router.get('/pages/:id/edit', [AdminPagesController, 'edit']).as('admin.pages.edit')
    router.get('/pages/:id', [AdminPagesController, 'show']).as('admin.pages.show')
    router.put('/pages/:id', [AdminPagesController, 'update']).as('admin.pages.update')
    router.delete('/pages/:id', [AdminPagesController, 'destroy']).as('admin.pages.destroy')
    router.post('/pages/reorder', [AdminPagesController, 'reorder']).as('admin.pages.reorder')
  })
  .prefix('/admin')
  .middleware([middleware.auth({ guards: ['admin'] }), middleware.admin()])

router
  .group(() => {
    router.post('/files/upload', [UploadsController, 'upload'])
  })
  .prefix('/admin')
  .middleware([middleware.auth({ guards: ['admin'] }), middleware.admin()])

// Public routes
router.get('pages/:slug', [PagesController, 'show']).as('pages.show')
