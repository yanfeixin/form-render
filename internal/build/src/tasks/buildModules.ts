import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { build } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import { convertEnv, generateExternal, getLibPath } from '../utils'
import { viteCssAlias } from '../plugins/vite-css-alias'

export async function buildModules() {
  const root = process.env.KING_COMPONENT_ROOT_PATH
  const { epOutput } = getLibPath(root!)
  const external = await generateExternal('node', root!)
  const envData = convertEnv(process.env)
  const output: any = [
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
  ]

  if (envData.KING_BUILD_CDN) {
    output.push({
      format: 'umd', // UMD
      entryFileNames: '[name].umd.js',
      exports: 'named',
      dir: `${root}/cdn`,
      name: 'GIE_COMPONENTS', // UMD 模块的全局变量名
      sourcemap: true, // 生成 sourcemap（可选）
      globals: {
        'vue': 'Vue', // UMD 格式的全局变量
        'ant-design-vue': 'antd',
        'axios': 'axios',
        'lodash-es': 'lodashEs'
      }
    })
  }
  await build({
    root,
    build: {
      // minify: false,
      cssCodeSplit: true,
      rollupOptions: {
        // 将vue模块排除在打包文件之外，使用用这个组件库的项目的vue模块。
        external,
        // 输出配置
        output,
        // treeshake: {
        //   moduleSideEffects: false
        // },
        treeshake: false
      },
      lib: {
        // 指定入口文件
        entry: 'index.ts',
        // 模块名
        name: 'GIE_COMPONENTS'
      }
    },
    plugins: [
      vue(),
      vueJsx({ optimize: true }),
      dts({
        entryRoot: root,
        // include: [root!, resolve(projRoot, './typings/global.d.ts')],
        // 输出目录
        outDir: ['dist/types'],
        // tsconfigPath: resolve(projRoot, 'tsconfg.lib.json'),
        // tsconfigPath: path.resolve(__dirname, '../../../../tsconfg.lib.json'),
        // 将动态引入转换为静态（例如：`import('vue').DefineComponent` 转换为 `import { DefineComponent } from 'vue'`）
        staticImport: true,
        beforeWriteFile: (_, content) => {
          if (!content) {
            return false
          }
        },
        // 将所有的类型合并到一个文件中
        rollupTypes: false
      }),
      viteCssAlias()
    ]
  })
}
