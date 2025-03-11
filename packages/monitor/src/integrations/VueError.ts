import type { App } from 'vue'
import type { ErrorMonitor } from '../core'
import type { Integration } from '../types'
// type Nullable<T> = T | null;
export class VueError implements Integration {
  name = 'VueError'
  app: App
  install(monitor: ErrorMonitor): void {
    this.app.config.errorHandler = async (error) => {
      const source = await monitor.getErrorSource(error as any)
      // eslint-disable-next-line no-console
      console.log(source)
      monitor.emitError(error as any)
    }
  }

  constructor(app: App) {
    this.app = app
  }
}
