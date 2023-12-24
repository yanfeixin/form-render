/*
 * @Author: caohao
 * @Date: 2023-12-11 14:46:53
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-24 19:03:17
 * @Description:
 */
import { resolve, join } from "path"
import { copy, copyFile } from "fs-extra"
import type { TaskFunction } from "gulp"
import { parallel } from "gulp"
import { buildOutput, buildConfig, getAntdvPath } from "../utils"
import type { Module } from "../utils"
export const copyTypesDefinitions: TaskFunction = (done) => {
  const src = resolve(buildOutput, "types", "packages")
  const config = buildConfig()
  const copyTypes = (module: Module) =>
    Object.assign(() => copy(src, config[module].output.path), {
      displayName: `copyTypes:${module}`,
    })

  return parallel(copyTypes("esm"), copyTypes("cjs"))(done)
}
export const copyThemeCdn = () => {
  const { antdvOutput, antdvOutputCdn } = getAntdvPath()
  return copyFile(resolve(antdvOutput, "theme-chalk", "index.css"), join(antdvOutputCdn, "index.css"))
}
export const copyComponentsPackages = () => {
  const { antdvRoot, antdvOutput } = getAntdvPath()
  return copyFile(resolve(antdvRoot, "package.json"), join(antdvOutput, "package.json"))
}
