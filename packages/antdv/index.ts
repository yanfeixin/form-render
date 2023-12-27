/*
 * @Author: caohao
 * @Date: 2023-12-18 10:15:35
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-27 16:54:27
 * @Description:
 */
import type { App, Plugin } from "vue"

import { KButton } from "./components/button"

const component = [KButton] as Plugin[]

export const install = function (app: App) {
  component.forEach((i) => app.use(i))
}

export default {
  install,
}
