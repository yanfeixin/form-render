/*
 * @Author: caohao
 * @Date: 2023-11-28 10:08:53
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-24 19:18:30
 * @Description:
 */
// import { PKG_NAME, PKG_PREFIX } from '@element-plus/build-constants'

import type { Plugin } from 'rollup'
import { getLibPath, PKG_PREFIX } from '../utils/paths'

export function KingPlusAlias(): Plugin {
  const { PKG_NAME } = getLibPath()
  const themeChalk = 'theme-chalk'
  const sourceThemeChalk = `${PKG_PREFIX}/${themeChalk}` as const
  const bundleThemeChalk = `${PKG_NAME}/${themeChalk}` as const

  return {
    name: 'king-one-alias',
    resolveId(id) {
      if (!id.startsWith(sourceThemeChalk)) return
      return {
        id: id.replaceAll(sourceThemeChalk, bundleThemeChalk),
        external: 'absolute'
      }
    }
  }
}
