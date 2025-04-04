import type { HttpContext } from '@adonisjs/core/http'
import Page from '#models/page'

export default class PagesController {
  /**
   * Get pages with nested structure up to 3 levels
   */
  async getPageHierarchy({ params }: HttpContext) {
    const pages = await Page.query()
      .where('type', params.type)
      .whereNull('parent_id') // Get top level pages
      .preload('children', (childrenQuery) => {
        childrenQuery.preload('children') // Load grandchildren
      })
      .orderBy('order')

    return pages
  }

  /**
   * Get single page with its breadcrumb trail
   */
  async show({ params }: HttpContext) {
    const page = await Page.query()
      .where('id', params.id)
      .preload('parent', (parentQuery) => {
        parentQuery.preload('parent') // Load grandparent
      })
      .firstOrFail()

    return page
  }

  /**
   * Get page navigation structure
   */
  async getNavigation() {
    return Page.getNavigation()
  }
}
