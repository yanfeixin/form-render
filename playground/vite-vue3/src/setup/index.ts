import type { App } from 'vue'
import { setupAntdv } from './antdv'

export function setupApp(app: App) {
  setupAntdv(app)
}
