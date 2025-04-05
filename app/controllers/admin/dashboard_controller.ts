import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  public async dashboard({ view, auth }: HttpContext) {
    const user = auth.user! // User must exist since passed through auth middleware

    return view.render('admin/dashboard', {
      user,
      title: 'Dashboard',
    })
  }
}
