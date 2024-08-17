/*
 * @Author: caohao
 * @Date: 2023-12-18 10:08:36
 * @LastEditors: caohao
 * @LastEditTime: 2024-01-02 11:12:56
 * @Description:
 */
import path from 'node:path'
import type { ModuleFormat, OutputOptions } from 'rollup'
import { PKG_HUMP_NAME, getLibPath } from './paths'

export const modules = ['esm', 'cjs'] as const
export type Module = (typeof modules)[number]
export interface BuildInfo {
  module: 'ESNext' | 'CommonJS'
  format: ModuleFormat
  ext: 'mjs' | 'cjs' | 'js'
  output: {
    // es
    name: string
    path: string
  }

  bundle: {
    path: string
  }
}
export function buildConfig(): Record<Module, BuildInfo> {
  const { epOutput, PKG_NAME } = getLibPath()
  return {
    esm: {
      module: 'ESNext',
      format: 'esm',
      ext: 'mjs',
      output: {
        name: 'es',
        path: path.resolve(epOutput, 'es')
      },
      bundle: {
        path: `${PKG_NAME}/es`
      }
    },
    cjs: {
      module: 'CommonJS',
      format: 'cjs',
      ext: 'js',
      output: {
        name: 'lib',
        path: path.resolve(epOutput, 'lib')
      },
      bundle: {
        path: `${PKG_NAME}/lib`
      }
    }
  }
}
export function buildCdnConfig(): OutputOptions[] {
  const { epOutputCdn } = getLibPath()
  return [
    {
      format: 'umd',
      file: path.resolve(epOutputCdn, 'index.cdn.js'),
      exports: 'named',
      name: PKG_HUMP_NAME,
      globals: {
        vue: 'Vue'
      },
      sourcemap: true
    },
    // https://github.com/vitejs/vite/issues/2204
    {
      format: 'esm',
      file: path.resolve(epOutputCdn, 'index.cdn.mjs'),
      sourcemap: true
    }
  ]
}
export type BuildConfigEntries = [Module, BuildInfo][]
export function buildConfigEntries() {
  const buildConfigList = buildConfig()
  return Object.entries(buildConfigList) as BuildConfigEntries
}

export type BuildConfig = ReturnType<typeof buildConfig>
