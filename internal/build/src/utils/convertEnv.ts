export interface ViteEnv {
  readonly KING_BUILD_CDN: boolean
  readonly KING_BUILD_UMD_NAME: string
  [key: string]: string | boolean | number
}

const envPrefix = 'KING_'

/**
 * 转换env配置
 * @param envOptions 环境变量对象
 * @description
 * - 将 'true'/'false' 字符串转换为布尔值
 * - 将数字字符串转换为数字类型
 * - 其他值保持原样
 */
export function convertEnv(envOptions: Record<string, any>): ViteEnv {
  const result: any = {}
  if (!envOptions)
    return result

  for (const envKey in envOptions) {
    let envVal = envOptions[envKey]
    if (envKey.startsWith(envPrefix)) {
      // 布尔值转换
      if (['true', 'false'].includes(envVal)) {
        envVal = envVal === 'true'
      }
      // 数字转换：只在能转为有效数字时才转换
      else if (!Number.isNaN(Number(envVal)) && String(Number(envVal)) === envVal) {
        envVal = Number(envVal)
      }
      result[envKey] = envVal
    }
  }
  return result
}
