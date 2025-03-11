import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { build } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import type { UserConfig } from 'vite'
import { type ViteEnv, convertEnv, generateExternal, getLibPath } from '../utils'
import { viteCssAlias } from '../plugins/vite-css-alias'

interface BuildConfig {
  root: string
  external: string[]
  epOutput: string
  envData: ViteEnv
}

// 创建 DTS 插件配置
function createDtsPlugin(root: string) {
  return dts({
    entryRoot: root,
    outDir: ['dist/types'],
    staticImport: true,
    beforeWriteFile: (_, content) => {
      if (!content)
        return false
    },
    rollupTypes: false
  })
}

// 创建基础构建配置
function createBaseBuildConfig(config: BuildConfig): UserConfig {
  return {
    root: config.root,
    plugins: [
      vue(),
      vueJsx({ optimize: true }),
      createDtsPlugin(config.root),
      viteCssAlias()
    ]
  }
}

// 创建标准模块构建配置
function createModulesBuildConfig(config: BuildConfig): UserConfig {
  const { root, external, epOutput } = config

  return {
    ...createBaseBuildConfig(config),
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        external,
        output: [
          {
            // 打包成 es module
            format: 'es',
            // 重命名
            entryFileNames: '[name].mjs',
            // 打包目录和开发目录对应
            preserveModules: true,
            // 输出目录
            dir: resolve(epOutput, 'es'),
            // 指定保留模块结构的根目录
            preserveModulesRoot: `${root}`
          },
          {
            // 打包成 commonjs
            format: 'cjs',
            exports: 'named',
            // 重命名
            entryFileNames: '[name].js',
            // 打包目录和开发目录对应
            preserveModules: true,
            // 输出目录
            dir: resolve(epOutput, 'lib')
            // 指定保留模块结构的根目录
            // preserveModulesRoot: `${root}/src`
          }
        ],
        treeshake: false
      },
      lib: {
        entry: 'index.ts',
        name: 'GIE_COMPONENTS'
      }
    }
  }
}

// 创建 CDN 构建配置
function createCdnBuildConfig(config: BuildConfig): UserConfig {
  const { external, epOutput, envData } = config
  const umdName = envData.KING_BUILD_UMD_NAME || 'KingDefault'

  return {
    ...createBaseBuildConfig(config),
    build: {
      rollupOptions: {
        external,
        output: {
          format: 'umd',
          entryFileNames: '[name].umd.js',
          exports: 'named',
          dir: resolve(epOutput, 'cdn'),
          name: umdName
        },
        treeshake: false
      },
      lib: {
        entry: 'index.ts',
        name: umdName
      }
    }
  }
}

export async function buildModules() {
  const root = process.env.KING_COMPONENT_ROOT_PATH!
  const { epOutput } = getLibPath(root)
  const external = await generateExternal('node', root)
  const envData = convertEnv(process.env)

  const baseConfig: BuildConfig = {
    root,
    external,
    epOutput,
    envData
  }

  // 构建标准模块
  await build(createModulesBuildConfig(baseConfig))

  // 构建 CDN 版本
  if (envData.KING_BUILD_CDN) {
    const cdnConfig = {
      ...baseConfig,
      external: await generateExternal('cdn', root)
    }
    await build(createCdnBuildConfig(cdnConfig))
  }
}
