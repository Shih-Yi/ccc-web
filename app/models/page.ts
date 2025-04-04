import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, beforeSave } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import string from '@adonisjs/core/helpers/string'

// Define PageType outside the class
const PAGE_TYPE_VALUES = ['about', 'im_new', 'whats_on', 'connect', 'library'] as const
type PageType = (typeof PAGE_TYPE_VALUES)[number]

export default class Page extends BaseModel {
  static readonly PAGE_TYPES = PAGE_TYPE_VALUES

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare parentId: number | null

  @column()
  declare type: PageType

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare content: string | null

  @column()
  declare order: number

  @column()
  declare isActive: boolean

  @column()
  declare metaTitle: string | null

  @column()
  declare metaDescription: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @belongsTo(() => Page, { foreignKey: 'parentId' })
  declare parent: BelongsTo<typeof Page>

  @hasMany(() => Page, { foreignKey: 'parentId' })
  declare children: HasMany<typeof Page>

  @beforeSave()
  public static async generateSlug(page: Page) {
    if (page.title && !page.slug) {
      // Convert title to slug format
      // "About Our Church" -> "about-our-church"
      page.slug = string.dashCase(page.title)
    }
  }

  /**
   * Get navigation structure for all page types
   */
  static async getNavigation(): Promise<Record<PageType, Page[]>> {
    const navigation: Partial<Record<PageType, Page[]>> = {}

    for (const type of this.PAGE_TYPES) {
      navigation[type] = await this.query()
        .where('type', type)
        .whereNull('parent_id')
        .preload('children', (childrenQuery) => {
          childrenQuery.preload('children')
        })
        .orderBy('order')
    }

    return navigation as Record<PageType, Page[]>
  }
}
