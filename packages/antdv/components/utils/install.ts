/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2024-09-17 00:15:40
 * @LastEditors: caohao
 * @LastEditTime: 2024-09-17 00:15:43
 */
import type { App, Directive, Plugin } from 'vue'

export type SFCWithInstall<T> = T & Plugin

const defaultNamePrefix: string = 'K'
export function withInstall<T>(main: T) {
  (main as SFCWithInstall<T>).install = (app): void => {
    const comp: Record<string, any> = main as Record<string, any>
    app.component(defaultNamePrefix + comp.name, comp)
  }
  return main as SFCWithInstall<T>
}

// 注册指令
export function withInstallDirectives<T extends Directive>(main: T, name: string) {
  return {
    install: (app: App): void => {
      app.directive(name, main)
    },
    directive: main
  }
}
