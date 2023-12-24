/*
 * @Author: caohao
 * @Date: 2023-11-06 19:57:56
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-23 15:35:24
 * @Description:
 */
import { resolve } from "path"
import { rollup } from "rollup"
import glob from "fast-glob"

import type { OutputOptions } from "rollup"
import { pkgRoot, getAntdvPath } from "../utils/paths"

import { buildCdnConfig, buildConfigEntries, rollupBuildPlugins, generateExternal } from "../utils"
// import { generateExternal, rollupBuildPlugins } from '../utils/rollup'

export const excludeFiles = (files: string[]) => {
  const excludes = ["node_modules", "test", "dist", "core"]
  return files.filter((path) => !excludes.some((exclude) => path.includes(exclude)))
}

// node
export const buildNodeModules = async () => {
  const { antdvRoot } = getAntdvPath()
  const input = excludeFiles(
    await glob("**/*.{js,ts,vue}", {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  )

  const bundle = await rollup({
    input,
    plugins: rollupBuildPlugins(),
    external: await generateExternal("node"),
    treeshake: false,
  })
  const buildConfigList = buildConfigEntries()
  const options = buildConfigList.map(([module, config]): OutputOptions => {
    return {
      format: config.format,
      dir: config.output.path,
      exports: module === "cjs" ? "named" : undefined,
      preserveModules: true,
      preserveModulesRoot: antdvRoot,
      // preserveModulesRoot: pkgRoot,
      sourcemap: true,
      entryFileNames: `[name].${config.ext}`,
    }
  })

  await Promise.all(
    options.map((option) => {
      return bundle.write(option)
    })
  )
}

// cdn
export const buildCdnModules = async () => {
  const { antdvRoot } = getAntdvPath()
  const bundle = await rollup({
    input: resolve(antdvRoot, "index.ts"),
    plugins: rollupBuildPlugins(true),
    external: await generateExternal("cdn"),
    treeshake: false,
  })
  const buildCdnConfigList = buildCdnConfig()
  await Promise.all(
    buildCdnConfigList.map((option) => {
      return bundle.write(option)
    })
  )
}
