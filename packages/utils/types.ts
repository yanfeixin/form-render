/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2023-10-04 19:34:53
 * @LastEditors: caohao
 * @LastEditTime: 2024-05-23 10:26:47
 */
import type { AppContext, Plugin, App, AllowedComponentProps } from 'vue'

export type SFCWithInstall<T> = T & Plugin
export type SFCInstallWithContext<T> = SFCWithInstall<T> & {
  _context: AppContext | null
}
export type PublicProps<T, U = {}> = Readonly<T> & U // vue 的公共 props
export type TypeWrapper<T> = T & { _?: never }

export type BaseComponent = new () => {
  name: string
  install(app: App): void
}

export type ComponentWrapper<Props = {}, Slots = {}, Expose = {}> = new () => {
  $props: Props & AllowedComponentProps
  $slots: Slots
} & Expose &
  BaseComponent
