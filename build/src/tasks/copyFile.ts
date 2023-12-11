/*
 * @Author: caohao
 * @Date: 2023-12-11 14:46:53
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-11 14:50:05
 * @Description:
 */
import { resolve, join } from 'path'
import { copy, copyFile } from 'fs-extra'
import type { TaskFunction } from 'gulp'
import { parallel } from 'gulp'
import { buildOutput, buildConfig } from '../utils'
import type { Module } from '../utils'
export const copyTypesDefinitions: TaskFunction = (done) => {
  const src = resolve(buildOutput, 'types', 'packages')
  const copyTypes = (module: Module) =>
    Object.assign(() => copy(src, buildConfig[module].output.path), {
      displayName: `copyTypes:${module}`,
    })

  return parallel(copyTypes('esm'), copyTypes('cjs'))(done)
}
