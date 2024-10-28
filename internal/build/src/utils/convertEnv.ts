interface ViteEnv {
  readonly KING_PKG_BUILD_CDN: boolean

}
const envPrefix = 'KING_'
/**
 * 转换env配置
 * @param envOptions
 * @descrition boolean和数字类型转换
 */
export function convertEnv(envOptions: Record<string, any>): ViteEnv {
  const result: any = {}
  if (!envOptions)
    return result

  for (const envKey in envOptions) {
    let envVal = envOptions[envKey]
    if (envKey.startsWith(envPrefix)) {
      if (['true', 'false'].includes(envVal))
        envVal = envVal === 'true'

      if (Number.isNaN(Number(envVal)))
        envVal = +envVal
      result[envKey] = envVal
    }
  }
  return result
}
