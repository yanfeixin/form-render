/*
 * @Author: caohao
 * @Date: 2023-12-07 11:25:02
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-19 15:08:59
 * @Description:
 */
import { PKG_NAME, PKG_PREFIX } from './paths'
import { buildConfig } from './buildConfig'

import type { Module } from './buildConfig'

/** used for type generator */
export const pathRewriter = (module: Module) => {
  const config = buildConfig[module]

  return (id: string) => {
    id = id.replaceAll(`${PKG_PREFIX}/theme-chalk`, `${PKG_NAME}/theme-chalk`)
    id = id.replaceAll(`/antdv`, ``)
    id = id.replaceAll(`${PKG_PREFIX}/`, `${config.bundle.path}/`)
    return id
  }
}
