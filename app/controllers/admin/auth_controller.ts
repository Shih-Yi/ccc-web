import AdminUser from '#models/admin_user'
import { HttpContext } from '@adonisjs/core/http'
import { adminLoginValidator } from '#validators/admin'

export default class AdminAuthController {
  async show({ view, i18n, response }: HttpContext) {
    // Add security headers
    this.addSecurityHeaders(response)

    return view.render('admin/auth/login', {
      title: i18n.t('messages.auth.login.title'),
    })
  }

  async login({ request, response, auth, session, i18n }: HttpContext) {
    // Add security headers
    this.addSecurityHeaders(response)

    try {
      // 1. Validate the request data
      const { email, password } = await request.validateUsing(adminLoginValidator)

      // 2. Verify the user's credentials
      const adminUser = await AdminUser.verifyCredentials(email, password)

      // 3. Login our user and use admin guard
      await auth.use('admin').login(adminUser)

      // 4. Regenerate session to prevent session fixation
      await session.regenerate()

      return response.redirect().toRoute('admin.dashboard')
    } catch (error) {
      // Use generic error message for better security
      session.flash('errors', { form: i18n.t('messages.auth.login.error') })

      // Add a small delay to prevent timing attacks
      await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 200))

      return response.redirect().back()
    }
  }

  async logout({ response, auth, session }: HttpContext) {
    // Add security headers
    this.addSecurityHeaders(response)

    await auth.use('admin').logout()

    // Regenerate session after logout
    await session.regenerate()

    return response.redirect().toRoute('admin.auth.login')
  }

  /**
   * Add security-related HTTP headers to responses
   */
  private addSecurityHeaders(response: any) {
    response.header('X-Content-Type-Options', 'nosniff')
    response.header('X-Frame-Options', 'DENY')
    response.header('X-XSS-Protection', '1; mode=block')
    response.header('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.header(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self';"
    )
  }
}
