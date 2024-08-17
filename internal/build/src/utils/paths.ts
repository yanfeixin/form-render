import { resolve } from 'node:path'

export const projRoot = resolve(__dirname, '..', '..', '..', '..')
const THEME_FILE_NAME = 'theme-chalk'
export const PKG_PREFIX = '@king-one'
export const PKG_HUMP_NAME = 'KingUI'
// dist
export const buildOutput = resolve(projRoot, 'dist')
export const buildRoot = resolve(projRoot, 'internal', 'build')
export const buildEnv = resolve(buildRoot, 'env')

// packages
// eslint-disable-next-line import/no-mutable-exports
export let pkgRoot = resolve(projRoot, 'packages')
export const pkThemeRoot = resolve(pkgRoot, THEME_FILE_NAME)

export function getLibPath() {
  const PKG_NAME = process.env.PKG_NAME as string // antdv
  const epRoot = resolve(pkgRoot, PKG_NAME)
  const epOutput = resolve(buildOutput, PKG_NAME) /* 根目录/dist/antdv  */
  const epOutputCdn = resolve(epOutput, 'cdn') /* 根目录/dist/antdv/cdn  */
  const epOutThemeRoot = resolve(epOutput, THEME_FILE_NAME) /* 根目录/dist/antdv/theme-chalk  */
  return {
    PKG_NAME,
    epOutput,
    epOutputCdn,
    epOutThemeRoot,
    epRoot
  }
}
export function setPkgRoot(root: string) {
  pkgRoot = resolve(projRoot, root)
}
