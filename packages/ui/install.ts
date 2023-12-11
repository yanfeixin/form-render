/*
 * @Author: caohao
 * @Date: 2023-12-11 14:11:32
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-11 14:32:10
 * @Description:
 */
import type { App } from 'vue'
import components from './components'
export const install = function (app: App) {
  components.forEach((i) => app.use(i))
}

export default {
  install,
}
