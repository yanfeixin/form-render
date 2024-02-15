/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2023-10-04 01:08:42
 * @LastEditors: caohao
 * @LastEditTime: 2024-02-07 16:02:02
 */
import { resolve } from 'node:path'
import { readdir } from 'fs/promises'
import { statSync } from 'fs'
// export const PKG_NAME = "king-one"
export const PKG_PREFIX = '@king-one'
export const PKG_HUMP_NAME = 'KingUI'
const THEME_FILE_NAME = 'theme-chalk'
export const projRoot = resolve(__dirname, '..', '..', '..')
export const buildRoot = resolve(projRoot, 'build')
// packages
export let pkgRoot = resolve(projRoot, 'packages')
export const pkThemeRoot = resolve(pkgRoot, THEME_FILE_NAME)
// dist
export const buildOutput = resolve(projRoot, 'dist')
export const getAntdvPath = () => {
  const PKG_NAME = process.env.PKG_NAME // antdv
  const epRoot = resolve(pkgRoot, PKG_NAME)
  const epOutput = resolve(buildOutput, PKG_NAME) /* 根目录/dist/antdv  */
  const epOutputCdn = resolve(epOutput, 'cdn') /* 根目录/dist/antdv/cdn  */
  const epOutThemeRoot = resolve(epOutput, THEME_FILE_NAME) /* 根目录/dist/antdv/theme-chalk  */
  return {
    PKG_NAME,
    epOutput,
    epOutputCdn,
    epOutThemeRoot,
    epRoot,
  }
}
export const getDirs = async (dir) => {
  const files = await readdir(dir)
  const dirs = []
  files.forEach((file) => {
    const path = resolve(dir, file)
    var stats = statSync(path)
    if (stats.isDirectory()) dirs.push(file)
  })
  return dirs
}
export const setPkgRoot = (root: string) => {
  pkgRoot = resolve(projRoot, root)
}
