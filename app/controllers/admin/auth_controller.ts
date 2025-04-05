import AdminUser from '#models/admin_user'
import { HttpContext } from '@adonisjs/core/http'
import { loginValidator } from '#validators/auth'

export default class AuthController {
  async showLogin({ view, i18n }: HttpContext) {
    return view.render('auth/login', {
      title: i18n.t('messages.auth.login.title'),
    })
  }

  async login({ request, response, auth, session, i18n }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)
      // 2. Verify the user's credentials
      const adminUser = await AdminUser.verifyCredentials(email, password)
      // 3. Login our user
      await auth.use('web').login(adminUser)
      return response.redirect().toRoute('/')
    } catch (error) {
      session.flash('errors', { form: i18n.t('messages.auth.login.error') })
      return response.redirect().back()
    }
  }

  async logout({ response, auth }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('/')
  }
}
