import Page from '#models/page'

export default class PagePolicy {
  // Check if page type can be changed
  canChangeType(page: Page) {
    return !page.isFirstLevel && !page.hasChildren
  }

  // Check if parent page can be changed
  canChangeParent(page: Page) {
    return !page.isFirstLevel && !page.hasChildren
  }

  // Check if page can be deleted
  canDelete(page: Page) {
    return !page.isFirstLevel && !page.hasChildren
  }

  // Check if parent page is valid
  isValidParent(parentPage: Page) {
    return parentPage.isFirstLevel || parentPage.parent?.isFirstLevel
  }

  isMatchingType(page: Page, parentPage: Page) {
    // Check type
    return page.type === parentPage.type
  }
}
