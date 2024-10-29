import type { PluginOption } from 'vite'

export function viteCssAlias(): PluginOption {
  const sourceThemeChalk = `@king-one/theme-chalk/src` as const
  const bundleThemeChalk = `@king-one/antdv/theme-chalk` as const
  return {
    name: 'vite-css-alias',
    apply: 'build',
    enforce: 'pre',
    resolveId(id) {
      if (id.startsWith(sourceThemeChalk)) {
        return {
          id: id.replaceAll(sourceThemeChalk, bundleThemeChalk).replaceAll('scss', 'css'),
          external: 'absolute'
        }
      }
    }
  }
}
