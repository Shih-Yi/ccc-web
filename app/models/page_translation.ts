import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Page from './page.js'

export default class PageTranslation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare pageId: number

  @column()
  declare locale: string

  @column()
  declare title: string

  @column()
  declare content: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Page)
  declare page: BelongsTo<typeof Page>
}
