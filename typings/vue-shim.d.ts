/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2024-02-14 03:42:12
 * @LastEditors: caohao
 * @LastEditTime: 2024-02-14 03:42:21
 */
/// <reference types="vite/client" />

declare module '*.vue' {
  import { App, defineComponent } from 'vue'
  const component: ReturnType<typeof defineComponent> & {
    install(app: App): void
  }
  export default component
}
