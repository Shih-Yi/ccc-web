import vine from '@vinejs/vine'

export const adminLoginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)

export const adminCreateValidator = vine.compile(
  vine.object({
    username: vine.string().minLength(3).maxLength(50),
    email: vine.string().email(),
    password: vine.string().minLength(8),
    name: vine.string().optional(),
    isActive: vine.boolean().optional(),
  })
)
