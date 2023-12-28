/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2023-10-04 19:34:53
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-28 13:58:03
 */
import type { AppContext, Plugin } from "vue"

export type SFCWithInstall<T> = T & Plugin
export type SFCInstallWithContext<T> = SFCWithInstall<T> & {
  _context: AppContext | null
}
export type PublicProps<T, U = {}> = Readonly<T> & U // vue 的公共 props
