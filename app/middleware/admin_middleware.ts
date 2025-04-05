import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'
import type AdminUser from '#models/admin_user'

export default class AdminMiddleware {
  async handle({ auth, response, session, request }: HttpContext, next: NextFn) {
    try {
      // Ensure user is logged in and using the admin guard (/config/auth.ts)
      await auth.use('admin').authenticate()

      // Check if user is admin (all AdminUser instances are admins)
      const adminUser = auth.user as AdminUser
      if (adminUser) {
        session.put('adminLastAccess', new Date().toISOString())
        return next()
      }

      // If not admin, redirect to error page
      return response.redirect().toRoute('errors.forbidden', {
        message: 'You do not have permission to access this area',
      })
    } catch (error) {
      // Handle unauthenticated case
      return response.redirect().toRoute('auth.login', {
        intended: request.url(),
      })
    }
  }
}
