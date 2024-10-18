/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2024-09-16 23:00:22
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-10-15 15:49:39
 */
import type { App, Plugin } from 'vue'
import { KForm, KVirtualList } from './src'

const component = [KForm, KVirtualList] as Plugin[]
export function install(app: App): any {
  component.forEach(i => app.use(i))
}
const plugin = {
  install
}
export default plugin
