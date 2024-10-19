/*
 * @Author: caohao
 * @Date: 2023-11-28 10:08:53
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-10-18 15:27:36
 * @Description:
 */
// import { PKG_NAME, PKG_PREFIX } from '@element-plus/build-constants'

import type { Plugin } from 'rollup'
import { PKG_PREFIX, getLibPath } from '../utils/paths'

export function KingPlusAlias(): Plugin {
  const { PKG_NAME } = getLibPath()
  const themeChalk = 'theme-chalk'
  const sourceThemeChalk = `${PKG_PREFIX}/${themeChalk}` as const
  const bundleThemeChalk = `${PKG_PREFIX}/${PKG_NAME}/${themeChalk}` as const

  return {
    name: 'king-one-alias',
    resolveId(id) {
      if (!id.startsWith(sourceThemeChalk))
        return
      return {
        id: id.replaceAll(sourceThemeChalk, bundleThemeChalk),
        external: 'absolute'
      }
    }
  }
}
