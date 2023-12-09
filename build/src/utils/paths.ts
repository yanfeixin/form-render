/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2023-10-04 01:08:42
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-09 16:45:25
 */
import { resolve } from 'node:path'
export const PKG_NAME = 'king-one'
export const PKG_PREFIX = '@king-one'
export const PKG_HUMP_NAME = 'Kingone'
const THEME_FILE_NAME = 'theme-chalk'
export const projRoot = resolve(__dirname, '..', '..', '..')
export const buildRoot = resolve(projRoot, 'build')
// packages
export const pkgRoot = resolve(projRoot, 'packages')
export const pkThemeRoot = resolve(pkgRoot, THEME_FILE_NAME)
export const epRoot = resolve(pkgRoot, 'ui')
export const compsRoot = resolve(pkgRoot, 'components')

// dist
export const buildOutput = resolve(projRoot, 'dist')
export const epOutput = resolve(buildOutput, PKG_NAME) /* 根目录/dist/king-one  */
export const epOutThemeRoot = resolve(epOutput, THEME_FILE_NAME)
export const epOutputCdn = resolve(epOutput, 'cdn') /* 根目录/dist/king-one/cdn  */
