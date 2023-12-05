/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2023-10-04 19:33:11
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-05 19:29:30
 */
import type { App, Directive } from 'vue'
import type { SFCWithInstall } from '../types'
const defaultNamePrefix: string = 'K'
export const withInstall = <T>(main: T) => {
  ;(main as SFCWithInstall<T>).install = (app): void => {
    const comp: Record<string, any> = main as Record<string, any>
    app.component(defaultNamePrefix + comp.name, comp)
  }
  return main as SFCWithInstall<T>
}

// 注册指令
export const withInstallDirectives = <T extends Directive>(main: T, name: string) => {
  return {
    install: (app: App): void => {
      app.directive(name, main)
    },
    directive: main,
  }
}
