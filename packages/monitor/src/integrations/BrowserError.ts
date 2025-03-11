import type { ErrorMonitor } from '../core'
import { getClientInfo } from '../utils'
import type { ErrorInfo, Integration } from '../types'

type Nullable<T> = T | null
export class BrowserError implements Integration {
  name = 'BrowserError'
  monitor: Nullable<ErrorMonitor> = null
  install(monitor: ErrorMonitor): void {
    this.monitor = monitor
    // 监听JS运行时错误
    window.addEventListener('error', (event) => {
      this.handleJsError(event)
    }, true)

    // 监听Promise异常
    window.addEventListener('unhandledrejection', (event) => {
      this.handlePromiseError(event)
    })

    // 监听资源加载错误
    window.addEventListener('error', (event) => {
      if (event.target && (event.target as any).tagName) {
        this.handleResourceError(event)
      }
    }, true)
  }

  /**
   * 处理 JS 运行时错误
   * @param event - 错误事件对象
   */
  private handleJsError(event: ErrorEvent) {
    const errorInfo: ErrorInfo = {
      type: 'js',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      ...getClientInfo()
    }

    if (this.monitor)
      this.monitor.emitError(errorInfo)
  }

  /**
   * 处理 Promise 异常
   * @param event - Promise 异常事件对象
   */
  private handlePromiseError(event: PromiseRejectionEvent) {
    const errorInfo: ErrorInfo = {
      type: 'promise',
      message: event.reason?.message || 'Promise Error',
      stack: event.reason?.stack,
      ...getClientInfo()
    }
    if (this.monitor)
      this.monitor.emitError(errorInfo)
  }

  /**
   * 处理资源加载错误
   * @param event - 资源错误事件对象
   */
  private handleResourceError(event: ErrorEvent) {
    const target = event.target as HTMLElement
    const errorInfo: ErrorInfo = {
      type: 'resource',
      message: `资源加载失败: ${target.tagName} ${(target as any).src || (target as any).href}`,
      ...getClientInfo()
    }
    if (this.monitor)
      this.monitor.emitError(errorInfo)
  }
}
