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
export function transformString(str, type) {
  switch (type) {
    case 'lowerCamelCase':
      return str.replace(/[-_]+(\w)/g, (_, c) => {
        return c.toUpperCase()
      })
    case 'upperCamelCase':
      return str.replace(/[-_]+(\w)/g, (_, c) => {
        return c.toUpperCase()
      }).replace(/^(\w)/, (_, c) => {
        return c.toUpperCase()
      })
    case 'upperCase':
      return str.toUpperCase()
    case 'kebabCase':
      // eslint-disable-next-line regexp/no-useless-assertions
      return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
    default:
      return str
  }
}
