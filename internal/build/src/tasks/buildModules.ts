/*
 * @Author: caohao
 * @Date: 2023-11-06 19:57:56
 * @LastEditors: caohao
 * @LastEditTime: 2024-05-20 14:48:31
 * @Description:
 */
import { resolve } from 'node:path'
import { rollup } from 'rollup'
import glob from 'fast-glob'

import type { OutputOptions } from 'rollup'
import { getLibPath, pkgRoot } from '../utils/paths'

import { buildCdnConfig, buildConfigEntries, generateExternal, rollupBuildPlugins } from '../utils'
// import { generateExternal, rollupBuildPlugins } from '../utils/rollup'

export function excludeFiles(files: string[]) {
  const excludes = ['node_modules', 'test', 'dist', 'build.config.ts'] // 'core'
  return files.filter(path => !excludes.some(exclude => path.includes(exclude)))
}

// node
export async function buildNodeModules() {
  const { epRoot, PKG_NAME } = getLibPath()
  const input = excludeFiles(
    // await glob([...epFiles, `${PKG_NAME}/**/*.{js,ts,vue}`], {
    await glob(`${PKG_NAME}/**/*.{js,ts,vue}`, {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true
    })
  )

  const bundle = await rollup({
    input,
    plugins: rollupBuildPlugins(),
    external: await generateExternal('node'),
    treeshake: false
  })
  const buildConfigList = buildConfigEntries()
  const options = buildConfigList.map(([module, config]): OutputOptions => {
    return {
      format: config.format,
      dir: config.output.path,
      exports: module === 'cjs' ? 'named' : undefined,
      preserveModules: true,
      preserveModulesRoot: epRoot,
      // preserveModulesRoot: pkgRoot,
      sourcemap: true,
      entryFileNames: `[name].${config.ext}`
    }
  })

  await Promise.all(
    options.map((option) => {
      return bundle.write(option)
    })
  )
}

// cdn
export async function buildCdnModules() {
  const { epRoot } = getLibPath()
  const bundle = await rollup({
    input: resolve(epRoot, 'index.ts'),
    plugins: rollupBuildPlugins(true),
    external: await generateExternal('cdn'),
    treeshake: false
  })
  const buildCdnConfigList = buildCdnConfig()
  await Promise.all(
    buildCdnConfigList.map((option) => {
      return bundle.write(option)
    })
  )
}
