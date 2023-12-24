/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2023-10-04 01:08:42
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-24 19:18:53
 */
import { resolve } from "node:path"
// export const PKG_NAME = "king-one"
export const PKG_PREFIX = "@king-one"
export const PKG_HUMP_NAME = "KingUI"
const THEME_FILE_NAME = "theme-chalk"
export const projRoot = resolve(__dirname, "..", "..", "..")
export const buildRoot = resolve(projRoot, "build")
// packages
export const pkgRoot = resolve(projRoot, "packages")
export const pkThemeRoot = resolve(pkgRoot, THEME_FILE_NAME)
// dist
export const buildOutput = resolve(projRoot, "dist")
export const getAntdvPath = () => {
  const PKG_NAME = process.env.PKG_NAME // antdv
  const epRoot = resolve(pkgRoot, PKG_NAME)
  const epOutput = resolve(buildOutput, PKG_NAME) /* 根目录/dist/antdv  */
  const epOutputCdn = resolve(epOutput, "cdn") /* 根目录/dist/antdv/cdn  */
  const epOutThemeRoot = resolve(epOutput, THEME_FILE_NAME) /* 根目录/dist/antdv/theme-chalk  */
  return {
    PKG_NAME,
    epOutput,
    epOutputCdn,
    epOutThemeRoot,
    epRoot,
  }
}
