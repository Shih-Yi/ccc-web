import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

// Simple in-memory storage for rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

/**
 * Rate limiter middleware to prevent brute force attacks
 */
export default class RateLimiterMiddleware {
  /**
   * Handle the incoming request
   */
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      /**
       * Number of maximum allowed requests
       */
      requests?: number

      /**
       * The duration in milliseconds in which the requests are counted
       */
      duration?: number

      /**
       * Prefix for the rate limit key
       */
      prefix?: string
    } = {}
  ) {
    // Default options
    const maxRequests = options.requests || 5
    const duration = options.duration || 600000 // 10 minutes in milliseconds
    const prefix = options.prefix || 'login'

    // Use IP address as the key
    const ip = ctx.request.ip()
    const key = `${prefix}:${ip}`

    const now = Date.now()
    let record = rateLimitStore.get(key)

    // Initialize or reset expired record
    if (!record || record.resetTime < now) {
      record = { count: 0, resetTime: now + duration }
    }

    // Increment count
    record.count++
    rateLimitStore.set(key, record)

    // Set rate limit headers
    const remaining = Math.max(0, maxRequests - record.count)
    ctx.response.header('X-RateLimit-Limit', maxRequests.toString())
    ctx.response.header('X-RateLimit-Remaining', remaining.toString())
    ctx.response.header('X-RateLimit-Reset', record.resetTime.toString())

    // Check if the request is allowed
    if (record.count > maxRequests) {
      ctx.session.flash('errors', { form: 'Too many login attempts. Please try again later.' })
      return ctx.response.status(429).redirect().back()
    }

    // Continue with the request
    return next()
  }
}
