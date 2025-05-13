import type { HttpContext } from '@adonisjs/core/http'
import BaseController from './base_controller.js'

export default class HomeController extends BaseController {
  async index({ view, i18n, logger }: HttpContext) {
    // Get shared data
    await this.getSharedData({ view })
    logger.info('- home controller logger -')
    return view.render('pages/home', {
      title: i18n.t('messages.home.title'),
    })
  }
}
