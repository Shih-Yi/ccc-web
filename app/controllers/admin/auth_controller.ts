import AdminUser from '#models/admin_user'
import { HttpContext } from '@adonisjs/core/http'
import { adminLoginValidator } from '#validators/admin'

export default class AdminAuthController {
  async show({ view, i18n }: HttpContext) {
    return view.render('admin/auth/login', {
      title: i18n.t('messages.auth.login.title'),
    })
  }

  async login({ request, response, auth, session, i18n }: HttpContext) {
    try {
      // 1. Validate the request data
      const { email, password } = await request.validateUsing(adminLoginValidator)
      // 2. Verify the user's credentials
      const adminUser = await AdminUser.verifyCredentials(email, password)
      // 3. Login our user and use admin guard
      await auth.use('admin').login(adminUser)
      return response.redirect().toRoute('admin.dashboard')
    } catch (error) {
      session.flash('errors', { form: i18n.t('messages.auth.login.error') })
      return response.redirect().back()
    }
  }

  async logout({ response, auth }: HttpContext) {
    await auth.use('admin').logout()
    return response.redirect().toRoute('admin.auth.login')
  }
}
