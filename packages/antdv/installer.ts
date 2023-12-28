/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2023-12-28 11:21:08
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-28 14:10:54
 */
import type { App, Plugin } from "vue"

import { KButton } from "./components/button"

const component = [KButton] as Plugin[]

// export type ObjectPlugin<Options = any[]> = {
//   install: PluginInstallFunction<Options>
// }
// export type FunctionPlugin<Options = any[]> = PluginInstallFunction<Options> & Partial<ObjectPlugin<Options>>
// export type Plugin<Options = any[]> = FunctionPlugin<Options> | ObjectPlugin<Options>
export const install = (app: App): any => {
  component.forEach((i) => app.use(i))
}
const Plugin = {
  install,
}
export default Plugin
