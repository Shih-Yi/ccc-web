import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'page_translations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('page_id').unsigned().references('id').inTable('pages').onDelete('CASCADE')
      table.string('title').nullable()
      table.string('locale', 10)
      table.text('content')
      table.timestamp('created_at')
      table.timestamp('updated_at')

      // make sure each page has only one translation for each locale
      table.unique(['page_id', 'locale'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
