// app/middleware/request_logger.ts
import type { HttpContext } from '@adonisjs/core/http'

export default class RequestLogger {
  public async handle(ctx: HttpContext, next: () => Promise<void>) {
    const { request, logger } = ctx
    const startTime = process.hrtime()

    // 基本請求信息
    logger.info(`Started ${request.method()} "${request.url()}" for ${request.ip()}`)

    // 獲取路由信息 - 嘗試多種方式
    const routeInfo = this.getRouteInfo(ctx)

    // 記錄處理前的信息 (針對非生產環境可能想保留這個)
    // if (routeInfo) {
    //   logger.info(`Will process by ${routeInfo.controller}#${routeInfo.action} as ${routeInfo.format}`)
    // }

    // 執行實際的請求處理
    await next()

    // 處理完成後記錄信息 (這更準確反映了實際處理的控制器/動作)
    if (routeInfo) {
      logger.info(`Processed by ${routeInfo.controller}#${routeInfo.action} as ${routeInfo.format}`)
    }

    // 完成請求并記錄時間
    const [seconds, nanoseconds] = process.hrtime(startTime)
    const duration = (seconds * 1000 + nanoseconds / 1000000).toFixed(2)
    logger.info(`Completed ${ctx.response.getStatus()} in ${duration}ms`)
  }

  /**
   * 獲取路由信息的輔助方法
   */
  private getRouteInfo(ctx: HttpContext) {
    const { request } = ctx

    // 嘗試獲取 route 對象 (但在 AdonisJS 6 中可能不可用)
    const route = ctx.route

    // 嘗試從 route 獲取 (如果存在)
    if (route && route.handler) {
      const handler = route.handler as string | any[] | Record<string, any>

      // 處理字符串格式的處理器
      if (typeof handler === 'string') {
        const parts = handler.split('.')
        return {
          controller: parts[0] || 'Unknown',
          action: parts[1] || 'Unknown',
          format: request.accepts(['html', 'json']) || 'unknown',
        }
      }

      // 處理數組格式的處理器
      if (Array.isArray(handler) && handler.length >= 2) {
        return {
          controller: String(handler[0]).replace(/\s*\(\)\s*/g, ''),
          action: String(handler[1]),
          format: request.accepts(['html', 'json']) || 'unknown',
        }
      }
    }

    // 嘗試從 request 對象獲取路由信息
    const routePath = request.url() || ''

    // 通過 URL 路徑推斷控制器和動作
    // 例如: /admin/login -> AdminAuthController#show
    const pathParts = routePath.split('/').filter(Boolean)

    if (pathParts.length > 0) {
      const segment1 = pathParts[0] || ''
      const segment2 = pathParts[1] || ''

      // 構建控制器名稱（基於約定）
      let controllerGuess = 'Unknown'
      let actionGuess = 'Unknown'

      if (segment1 === 'admin' && segment2) {
        // 管理路由: /admin/login -> AdminAuthController
        if (segment2 === 'login') {
          controllerGuess = 'AdminAuthController'
          actionGuess = 'show'
        } else {
          controllerGuess = `Admin${this.capitalize(segment2)}Controller`
          actionGuess = pathParts[2] || 'index'
        }
      } else {
        // 普通路由: /pages/about -> PagesController
        controllerGuess = `${this.capitalize(segment1)}Controller`
        actionGuess = segment2 || 'index'
      }

      return {
        controller: controllerGuess,
        action: actionGuess,
        format: request.accepts(['html', 'json']) || 'unknown',
      }
    }

    // 找不到有效的路由信息
    return null
  }

  /**
   * 將字符串首字母大寫
   */
  private capitalize(str: string): string {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
}
