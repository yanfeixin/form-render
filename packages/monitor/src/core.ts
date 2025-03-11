import type { ClientInfo, ErrorInfo, ErrorSourceInfo, MonitorOptions } from './types'
import { EventEmitter } from './EventEmitter'
import { SourceError } from './SourceError'
/**
 * 前端错误监控类
 * 用于捕获并上报前端运行时错误、Promise异常和资源加载错误
 */
export class ErrorMonitor {
  private static instance: ErrorMonitor | null = null
  private options: MonitorOptions
  private event: EventEmitter
  private source: SourceError
  // 错误事件类型常量
  private readonly ERROR_REPORTED = 'error-reported'

  /**
   * 订阅错误上报事件
   * @param callback - 错误上报回调函数
   */
  private onErrorReported(callback: (error: any) => void): void {
    this.event.on(this.ERROR_REPORTED, callback)
  }

  /**
   * 取消订阅错误上报事件
   * @param callback - 错误上报回调函数
   */
  // private offErrorReported(callback: (error: ErrorInfo) => void): void {
  //     this.event.off(this.ERROR_REPORTED, callback);
  // }
  /**
   * 私有构造函数，防止外部直接实例化
   */
  private constructor(options: MonitorOptions) {
    this.options = this.validateOptions(options)
    this.event = new EventEmitter()
    this.source = new SourceError()
    this.init()
    if (options.integrations)
      this.initIntegrations()
  }

  private initIntegrations(): void {
    this.options.integrations?.forEach((integration) => {
      try {
        integration.install(this)
      }
      catch (error) {
        console.error(`Failed to initialize integration ${integration.name}:`, error)
      }
    })
  }

  /**
   * 获取ErrorMonitor实例
   * @throws {Error} 当实例未初始化时抛出错误
   */
  private static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      throw new Error('ErrorMonitor未初始化，请先调用initialize方法')
    }
    return ErrorMonitor.instance
  }

  /**
   * 静态方法：手动上报错误信息
   * @param error - 错误信息，支持 ErrorInfo | Error | string 类型
   * @example
   * ```typescript
   * // 上报字符串错误
   * ErrorMonitor.captureError('自定义错误信息');
   *
   * // 上报 Error 对象
   * ErrorMonitor.captureError(new Error('发生错误'));
   *
   * // 上报完整错误信息
   * ErrorMonitor.captureError({
   *   type: 'custom',
   *   message: '自定义错误',
   *   stack: '错误堆栈'
   * });
   * ```
   */

  /**
   * 验证并补充默认配置项
   * @param options - 原始配置项
   * @returns 处理后的完整配置项
   * @throws {Error} 当必要配置项缺失时抛出错误
   */
  private validateOptions(options: MonitorOptions): MonitorOptions {
    if (!options.url) {
      throw new Error('上报地址url不能为空')
    }
    if (!options.appId) {
      throw new Error('应用标识appId不能为空')
    }

    return {
      env: 'production',
      sampleRate: 1,
      ...options
    }
  }

  /**
   * 初始化错误监听器
   * 包括：JS运行时错误、Promise异常、资源加载错误
   */
  private init() {
    this.onErrorReported((error: ErrorInfo | Error | string) => {
      this.reportError(error)
    })
  }

  /**
   * 获取当前客户端信息
   * @returns 包含URL、浏览器信息、屏幕尺寸等客户端数据
   */
  private getClientInfo(): Partial<ClientInfo> {
    return {
      url: window.location.href,
      userAgent: navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      timestamp: Date.now()
    }
  }

  /**
   * 上报错误信息到服务器
   * @param errorInfo - 错误信息对象
   */
  private report(errorInfo: ErrorInfo) {
    // 采样率控制，避免数据量过大
    if (Math.random() > (this.options.sampleRate || 1)) {
      return
    }

    // 构建上报数据
    let reportData = {
      ...errorInfo,
      appId: this.options.appId,
      env: this.options.env
    }

    // 执行上报前的数据处理
    if (this.options.beforeSend) {
      const result = this.options.beforeSend(reportData)
      if (!result) {
        return
      }
      reportData = result
    }

    // 优先使用 sendBeacon 上报，保证页面卸载时数据不丢失
    if (navigator.sendBeacon) {
      navigator.sendBeacon(this.options.url, JSON.stringify(reportData))
    }
    else {
      // 降级使用 fetch，设置 keepalive 确保请求完成
      fetch(this.options.url, {
        method: 'POST',
        body: JSON.stringify(reportData),
        headers: {
          'Content-Type': 'application/json'
        },
        keepalive: true
      }).catch(() => {
        // 忽略上报失败，避免影响主业务
      })
    }
  }

  /**
   * 标准化错误信息
   * @param error - 原始错误信息
   * @returns 标准化后的错误信息对象
   */
  private normalizeError(error: ErrorInfo | Error | string): ErrorInfo {
    // 如果已经是 ErrorInfo 类型，直接返回
    if (this.isErrorInfo(error)) {
      return {
        ...error,
        extraInfo: this.options.extraInfo
      }
    }

    // 如果是 Error 对象
    if (error instanceof Error) {
      return {
        type: 'js',
        message: error.message,
        stack: error.stack,
        extraInfo: this.options.extraInfo,
        ...this.getClientInfo()
      }
    }

    // 如果是字符串
    return {
      type: 'js',
      message: error,
      extraInfo: this.options.extraInfo,
      ...this.getClientInfo()
    }
  }

  /**
   * 类型守卫：判断是否为 ErrorInfo 类型
   * @param error - 待检查的错误信息
   * @returns 是否为 ErrorInfo 类型
   */
  private isErrorInfo(error: any): error is ErrorInfo {
    return (
      typeof error === 'object'
      && error !== null
      && 'type' in error
      && 'message' in error
    )
  }

  public reportError(error: ErrorInfo | Error | string) {
    if (!ErrorMonitor.instance) {
      throw new Error('ErrorMonitor未初始化，请先调用initialize方法')
    }
    const errorInfo = this.normalizeError(error)
    // eslint-disable-next-line no-console
    console.log('errorInfo', errorInfo)
    this.report(errorInfo)
  }

  /**
   * 初始化错误监控实例
   * @param options - 监控配置项
   * @returns ErrorMonitor实例
   * @throws {Error} 当重复初始化或配置项缺失时抛出错误
   */
  public static initialize(options: MonitorOptions): ErrorMonitor {
    if (ErrorMonitor.instance) {
      throw new Error('ErrorMonitor已经初始化，请勿重复初始化')
    }
    ErrorMonitor.instance = new ErrorMonitor(options)
    return ErrorMonitor.instance
  }

  /**
   * 销毁实例，清理资源
   */
  public static destroy(): void {
    if (ErrorMonitor.instance) {
      ErrorMonitor.instance = null
    }
  }

  public static captureError(error: ErrorInfo | Error | string): void {
    ErrorMonitor.getInstance().reportError(error)
  }

  public emitError(error: ErrorInfo | Error | string) {
    this.event.emit(this.ERROR_REPORTED, error)
  }

  public async getErrorSource(
    error: Error | null | undefined
  ): Promise<ErrorSourceInfo | null> {
    return this.source.getErrorSource(error)
  }
}
