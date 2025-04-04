import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Self-referencing for hierarchical structure
      table
        .integer('parent_id')
        .unsigned()
        .references('id')
        .inTable('pages')
        .onDelete('CASCADE')
        .nullable()

      // Page type enum
      table.enum('type', ['about', 'im_new', 'whats_on', 'connect', 'library']).notNullable()

      // Basic page info
      table.string('title').notNullable()
      table.string('slug').notNullable().unique()
      table.text('content').nullable()
      table.integer('order').defaultTo(0)
      table.boolean('is_active').defaultTo(true)

      // Meta data
      table.string('meta_title').nullable()
      table.string('meta_description').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
