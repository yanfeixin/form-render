/*
 * @Author: caohao
 * @Date: 2023-12-07 11:25:02
 * @LastEditors: caohao
 * @LastEditTime: 2024-03-13 14:34:27
 * @Description:
 */
import { PKG_PREFIX, getLibPath } from './paths'
import { buildConfig } from './buildConfig'

import type { Module } from './buildConfig'

/** used for type generator */
export function pathRewriter(module: Module) {
  const config = buildConfig()[module]
  const { PKG_NAME } = getLibPath()
  return (id: string) => {
    id = id.replaceAll(`/${PKG_NAME}`, ``)
    id = id.replaceAll(`${PKG_PREFIX}/`, `${PKG_PREFIX}/${config.bundle.path}/`)
    id = id.replaceAll(`${config.bundle.path}/theme-chalk`, `${PKG_NAME}/theme-chalk`)
    return id
  }
}
