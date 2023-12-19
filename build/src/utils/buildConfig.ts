/*
 * @Author: caohao
 * @Date: 2023-12-18 10:08:36
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-19 18:10:26
 * @Description:
 */
import path from 'path'
import type { ModuleFormat, OutputOptions } from 'rollup'
import { PKG_NAME, epOutput, PKG_HUMP_NAME, epOutputCdn, antdvOutput, antdvOutputCdn } from './paths'

export const modules = ['esm', 'cjs'] as const
export type Module = (typeof modules)[number]
export interface BuildInfo {
  module: 'ESNext' | 'CommonJS'
  format: ModuleFormat
  ext: 'mjs' | 'cjs' | 'js'
  output: {
    // es
    name: string
    // dist/xs-components
    path: string
  }

  bundle: {
    // xs-components/es
    path: string
  }
}

export const buildConfig: Record<Module, BuildInfo> = {
  esm: {
    module: 'ESNext',
    format: 'esm',
    ext: 'mjs',
    output: {
      name: 'es',
      path: path.resolve(antdvOutput, 'es'),
    },
    bundle: {
      path: `${PKG_NAME}/es`,
    },
  },
  cjs: {
    module: 'CommonJS',
    format: 'cjs',
    ext: 'js',
    output: {
      name: 'lib',
      path: path.resolve(antdvOutput, 'lib'),
    },
    bundle: {
      path: `${PKG_NAME}/lib`,
    },
  },
}

export const buildCdnConfig: OutputOptions[] = [
  {
    format: 'umd',
    file: path.resolve(antdvOutputCdn, 'index.cdn.js'),
    exports: 'named',
    name: PKG_HUMP_NAME,
    globals: {
      vue: 'Vue',
    },
    sourcemap: true,
  },
  // https://github.com/vitejs/vite/issues/2204
  {
    format: 'esm',
    file: path.resolve(antdvOutputCdn, 'index.cdn.mjs'),
    sourcemap: true,
  },
]

export type BuildConfigEntries = [Module, BuildInfo][]
export const buildConfigEntries = Object.entries(buildConfig) as BuildConfigEntries

export type BuildConfig = typeof buildConfig
