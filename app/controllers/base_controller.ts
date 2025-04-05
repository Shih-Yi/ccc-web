import type { HttpContext } from '@adonisjs/core/http'
import Page from '#models/page'

export default class BaseController {
  protected async getSharedData({ view }: { view: HttpContext['view'] }) {
    // Get navigation structure
    const navigation = await Page.getNavigation()

    // Set shared view variables
    view.share({
      navigation,
      pageType: Page.PAGE_TYPES,
      // Other shared data...
    })
  }
}
