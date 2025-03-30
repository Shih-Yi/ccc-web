import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  async index({ view, i18n }: HttpContext) {
    return view.render('pages/home', {
      title: i18n.t('messages.home.title'),
    })
  }
}
