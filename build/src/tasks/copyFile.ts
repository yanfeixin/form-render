/*
 * @Author: caohao
 * @Date: 2023-12-11 14:46:53
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-23 16:24:31
 * @Description:
 */
import { resolve } from "path"
import { copy } from "fs-extra"
import type { TaskFunction } from "gulp"
import { parallel } from "gulp"
import { buildOutput, buildConfig } from "../utils"
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
