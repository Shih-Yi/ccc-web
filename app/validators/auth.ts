import vine from '@vinejs/vine'

// Define full name validation rule: string, max length 100, optional
export const fullNameRule = vine.string().maxLength(100).optional()

// Register form validation rules
export const registerValidator = vine.compile(
  vine.object({
    fullName: fullNameRule,
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const adminUser = await db.from('admin_users').where('email', value).first()
        return !adminUser
      }),
    password: vine.string().minLength(8),
  })
)

// Login form validation rules
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string(),
    isRememberMe: vine.accepted().optional(), // "Remember me" option, optional
  })
)
