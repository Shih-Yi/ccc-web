// app/middleware/request_logger.ts
import { HttpContext } from '@adonisjs/core/http'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import { performance } from 'node:perf_hooks'

export default class RequestLogger {
  private requestStartTime: number = 0

  public async handle(ctx: HttpContext, next: () => Promise<void>) {
    const { request, response, logger } = ctx
    this.requestStartTime = performance.now()

    // 記錄請求開始
    const timestamp = new Date().toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZoneName: 'short',
    })

    logger.info(
      `Started ${request.method()} "${request.url(true)}" for ${request.ip()} at ${timestamp}`
    )

    try {
      // 執行請求
      await next()

      // 記錄路由信息 - 只用一行節省空間
      if (ctx.route) {
        try {
          // 使用 any 類型來處理實際結構
          const handler = (ctx.route.handler as any) || {}
          const controller = handler.name || 'Unknown'
          const method =
            handler.reference && Array.isArray(handler.reference) && handler.reference.length > 1
              ? handler.reference[1]
              : 'Unknown'
          const routeName = ctx.route.name || 'Unnamed'
          const pattern = ctx.route.pattern || 'No pattern'

          // 所有路由信息合併為一行
          logger.info(`Route: ${pattern} => ${controller}#${method} (${routeName})`)
        } catch (error) {
          logger.warn(`Error extracting route info: ${error.message}`)
        }
      }

      // 記錄請求參數
      await this.logRequestParams(ctx)

      // 記錄完成時間
      const duration = performance.now() - this.requestStartTime
      const contentType = response.getHeader('content-type') || ''
      logger.info(`Completed ${response.getStatus()} ${contentType} in ${duration.toFixed(1)}ms`)
    } catch (error) {
      // 記錄錯誤
      const duration = performance.now() - this.requestStartTime
      logger.error(
        `Failed with ${error.status || 500} (${error.message}) in ${duration.toFixed(1)}ms`
      )
      throw error
    }
  }

  /**
   * 記錄所有請求參數
   */
  private async logRequestParams(ctx: HttpContext) {
    const { request, logger } = ctx

    try {
      // 獲取所有參數（包括 GET 和 POST）
      const allParams = request.all()

      // 過濾敏感數據並記錄
      if (Object.keys(allParams).length > 0) {
        const safeParams = this.filterSensitiveData(allParams)
        logger.info(`Parameters: ${JSON.stringify(safeParams)}`)
      }

      // 特殊處理表單數據 (針對 PUT、PATCH 等請求)
      const method = request.method().toUpperCase()
      const isFormMethod = ['PUT', 'PATCH', 'POST'].includes(method)

      if (isFormMethod) {
        try {
          // 嘗試從請求體獲取數據
          const body = request.body
          if (body && Object.keys(body).length > 0) {
            const safeBody = this.filterSensitiveData(body)
            logger.info(`Request body: ${JSON.stringify(safeBody)}`)
          }

          // 嘗試動態獲取所有表單數據
          // 而不是依賴硬編碼的字段列表
          const formData = request.all()
          if (formData && Object.keys(formData).length > 0) {
            // 只有當 formData 與 allParams 不同時才記錄
            // 避免重複記錄相同的數據
            if (JSON.stringify(formData) !== JSON.stringify(allParams)) {
              const safeFormData = this.filterSensitiveData(formData)
              logger.info(`Form data: ${JSON.stringify(safeFormData)}`)
            }
          }
        } catch (e) {
          logger.warn(`Error extracting form data: ${e.message}`)
        }
      }

      // 獲取上傳的文件
      try {
        const files = request.allFiles()
        if (Object.keys(files).length > 0) {
          // 使用 getFileInfo 提取文件信息
          const fileInfos = Object.entries(files).map(([key, file]) => ({
            field: key,
            ...this.getFileInfo(file as MultipartFile),
          }))
          logger.info(`Files: ${JSON.stringify(fileInfos)}`)
        }
      } catch (e) {
        logger.warn(`Error processing uploaded files: ${e.message}`)
      }
    } catch (error) {
      logger.error(`Error logging request parameters: ${error.message}`)
    }
  }

  /**
   * 獲取文件信息
   */
  private getFileInfo(file: MultipartFile) {
    return {
      name: file.clientName,
      size: file.size,
      type: file.type,
      subtype: file.subtype,
    }
  }

  /**
   * 過濾敏感數據
   */
  private filterSensitiveData(data: Record<string, any>): Record<string, any> {
    if (!data || typeof data !== 'object' || data === null) {
      return data
    }

    // 處理數組
    if (Array.isArray(data)) {
      return data.map((item) => this.filterSensitiveData(item))
    }

    const filtered = { ...data }
    const sensitiveFields = [
      '_csrf',
      'password',
      'password_confirmation',
      'currentPassword',
      'newPassword',
      'credit_card',
      'card_number',
      'secret',
      'token',
      'api_key',
      'apikey',
      'authorization',
      'auth',
    ]

    for (const key of Object.keys(filtered)) {
      // 檢查是否為敏感字段
      if (sensitiveFields.some((field) => key.toLowerCase().includes(field.toLowerCase()))) {
        filtered[key] = '[FILTERED]'
      }
      // 遞歸處理嵌套對象
      else if (typeof filtered[key] === 'object' && filtered[key] !== null) {
        filtered[key] = this.filterSensitiveData(filtered[key])
      }
    }

    return filtered
  }
}
