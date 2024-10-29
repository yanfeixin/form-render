import { resolve } from 'node:path'

export const THEME_FILE_NAME = 'theme-chalk'
export const projRoot = resolve(__dirname, '..', '..', '..', '..')
export const buildRoot = resolve(projRoot, 'internal', 'build')
export const buildEnv = resolve(buildRoot, 'env')
// packages
export const pkgRoot = resolve(projRoot, 'packages')
export const pkThemeRoot = resolve(pkgRoot, THEME_FILE_NAME)

export function getLibPath(epRoot) {
  const epOutput = resolve(epRoot, 'dist') /* 根目录/packages/antdv/dist  */
  return {
    epOutput
  }
}
