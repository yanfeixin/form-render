type EventHandler = (...args: any[]) => void

export class EventEmitter<EventTypes extends string = string> {
  private events: Map<EventTypes, Set<EventHandler>> = new Map()

  /**
   * 订阅事件
   * @param eventName 事件名称
   * @param handler 事件处理函数
   */
  public on(eventName: EventTypes, handler: EventHandler): void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, new Set())
    }
    const handlers = this.events.get(eventName)!
    handlers.add(handler)
  }

  /**
   * 取消订阅事件
   * @param eventName 事件名称
   * @param handler 事件处理函数
   */
  public off(eventName: EventTypes, handler: EventHandler): void {
    const handlers = this.events.get(eventName)
    if (handlers) {
      handlers.delete(handler)
      if (handlers.size === 0) {
        this.events.delete(eventName)
      }
    }
  }

  /**
   * 触发事件
   * @param eventName 事件名称
   * @param args 事件参数
   */
  public emit(eventName: EventTypes, ...args: any[]): void {
    const handlers = this.events.get(eventName)
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(...args)
        }
        catch (error) {
          console.error(`Error in event handler for ${eventName}:`, error)
        }
      })
    }
  }

  /**
   * 清除所有订阅
   */
  protected clear(): void {
    this.events.clear()
  }

  /**
   * 获取指定事件的订阅者数量
   * @param eventName 事件名称
   * @returns 订阅者数量
   */
  private getSubscriberCount(eventName: EventTypes): number {
    const handlers = this.events.get(eventName)
    return handlers ? handlers.size : 0
  }

  /**
   * 检查是否有订阅者
   * @param eventName 事件名称
   * @returns 是否有订阅者
   */
  public hasSubscribers(eventName: EventTypes): boolean {
    return this.getSubscriberCount(eventName) > 0
  }
}
