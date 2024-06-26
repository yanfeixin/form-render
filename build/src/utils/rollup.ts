/*
 * @Author: caohao
 * @Date: 2023-11-06 20:17:06
 * @LastEditors: caohao
 * @LastEditTime: 2024-05-23 13:50:53
 * @Description:
 */
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import image from '@rollup/plugin-image'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import type { InputPluginOption } from 'rollup'
import { pkgRoot, getLibPath } from './paths'
import { KingPlusAlias } from '../plugins/king-one-alias'
/**
 * TODO: ReferenceError: __name is not defined
 * https://github.com/vuejs/core/issues/8303
 * https://github.com/esbuild-kit/tsx/issues/113
 * https://github.com/evanw/esbuild/issues/2605
 */
const __defProp = Object.defineProperty
const __name = (target: any, value: any) => __defProp(target, 'name', { value, configurable: true })
;(globalThis as any).__name = __name

// export const epPackage = resolve(pkgRoot, 'antdv', 'package.json')

export const epPackage = () => {
  const { PKG_NAME } = getLibPath()
  return resolve(pkgRoot, PKG_NAME, 'package.json')
}
/**
 * 获取package.json文件内容
 * @param pkgPath package.json路径
 * @returns package.json Object
 */
export const getPackageManifest = (pkgPath: string) => {
  return require(pkgPath)
}

/**
 * 查找package.json dependencies peerDependencies 配置
 * @param pkgPath package.json路径
 * @returns {dependencies:{...},peerDependencies:{...}}
 */
export const getPackageDependencies = (pkgPath: string): Record<'dependencies' | 'peerDependencies', string[]> => {
  const manifest = getPackageManifest(pkgPath)
  const { dependencies = {}, peerDependencies = {} } = manifest

  return {
    dependencies: Object.keys(dependencies),
    peerDependencies: Object.keys(peerDependencies)
  }
}

/**
 * 外部引入库标识，以防Rollup打包在一起
 * @param buildType 'node' | 'cdn'
 * @returns string[]
 */
export const generateExternal = async (buildType: 'node' | 'cdn') => {
  const PackagePath = epPackage()
  const { dependencies, peerDependencies } = getPackageDependencies(PackagePath)
  if (buildType === 'cdn') {
    return [...peerDependencies]
  }
  return [...dependencies, ...peerDependencies, 'vue']
}

/**
 * Rollup插件配置
 * @param minify:boolen 是否压缩生成的 JavaScript 代码
 * @returns plugins[]
 */
export const rollupBuildPlugins = (minify?: boolean): InputPluginOption => {
  const plugins: InputPluginOption = [
    KingPlusAlias(),
    vue({
      isProduction: true
    }),
    vueJsx(),
    // 图片处理
    image(),
    // Rollup 处理外部模块
    nodeResolve({
      extensions: ['.mjs', '.js', '.json', '.ts']
    }),
    // Esm 编译器
    esbuild({
      target: 'es2019',
      loaders: {
        '.vue': 'ts'
      },
      minify
      // keepNames: true,
    }),
    // Rollup 识别 commonjs
    commonjs()
  ]
  return plugins
}
