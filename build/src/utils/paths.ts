/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2023-10-04 01:08:42
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-23 16:49:16
 */
import { resolve } from "node:path"
export const PKG_NAME = "king-one"
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
  const PKG_NAME = process.env.PKG_NAME
  const antdvRoot = resolve(pkgRoot, "antdv")
  const antdvOutput = resolve(buildOutput, PKG_NAME) /* 根目录/dist/antdv  */
  const antdvOutputCdn = resolve(antdvOutput, "cdn") /* 根目录/dist/antdv/cdn  */
  const antdvOutThemeRoot = resolve(antdvOutput, THEME_FILE_NAME) /* 根目录/dist/antdv/theme-chalk  */
  return {
    PKG_NAME,
    antdvOutput,
    antdvOutputCdn,
    antdvOutThemeRoot,
    antdvRoot,
  }
}
