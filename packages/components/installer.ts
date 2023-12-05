/*
 * @Author: caohao
 * @Date: 2023-11-29 16:46:53
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-05 19:19:34
 * @Description:
 */
import type { App, Plugin } from 'vue'

import { KButton } from './button'

const component = [KButton] as Plugin[]

export const install = function (app: App) {
  component.forEach((i) => app.use(i))
}

export default {
  install,
}
