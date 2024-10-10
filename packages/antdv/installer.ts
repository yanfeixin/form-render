/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2024-09-16 23:00:22
 * @LastEditors: caohao
 * @LastEditTime: 2024-09-17 00:30:39
 */
import type { App, Plugin } from 'vue'
import { KForm } from './src'

const component = [KForm] as Plugin[]
export function install(app: App): any {
  component.forEach(i => app.use(i))
}
const plugin = {
  install
}
export default plugin
