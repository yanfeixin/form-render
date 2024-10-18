import 'ant-design-vue/dist/reset.css'
import Antd from 'ant-design-vue'
import type { App } from 'vue'

export function setupAntdv(app: App) {
  app.use(Antd)
}
