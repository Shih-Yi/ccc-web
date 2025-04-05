import vine from '@vinejs/vine'
import { PAGE_TYPE_VALUES } from '#models/page'

export const pageValidator = vine.compile(
  vine.object({
    type: vine.enum(PAGE_TYPE_VALUES),
    parentId: vine.number().optional().nullable(),
    isActive: vine.boolean().optional(),
    translations: vine.object({
      en: vine
        .object({
          title: vine.string().trim().minLength(1).maxLength(255),
          content: vine.string().nullable(),
        })
        .optional(),
      zh_TW: vine
        .object({
          title: vine.string().trim().nullable(),
          content: vine.string().nullable(),
        })
        .optional(),
      zh_CN: vine
        .object({
          title: vine.string().trim().nullable(),
          content: vine.string().nullable(),
        })
        .optional(),
    }),
  })
)
