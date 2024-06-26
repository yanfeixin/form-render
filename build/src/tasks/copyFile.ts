/*
 * @Author: caohao
 * @Date: 2023-12-11 14:46:53
 * @LastEditors: caohao
 * @LastEditTime: 2024-05-20 14:59:30
 * @Description:
 */
import { resolve, join } from 'path'
import { copy, copyFile } from 'fs-extra'
import type { TaskFunction } from 'gulp'
import { parallel } from 'gulp'
import { buildOutput, buildConfig, getLibPath } from '../utils'
import type { Module } from '../utils'
export const copyTypesDefinitions: TaskFunction = (done) => {
  const src = resolve(buildOutput, 'types', process.env.PKG_ROOT_PATH)
  const config = buildConfig()
  const copyTypes = (module: Module) =>
    Object.assign(() => copy(src, config[module].output.path), {
      displayName: `copyTypes:${module}`
    })

  return parallel(copyTypes('esm'), copyTypes('cjs'))(done)
}
export const copyThemeCdn = () => {
  const { epOutput, epOutputCdn } = getLibPath()
  return copyFile(resolve(epOutput, 'theme-chalk', 'index.css'), join(epOutputCdn, 'index.css'))
}
export const copyComponentsPackages = () => {
  const { epRoot, epOutput } = getLibPath()
  return copyFile(resolve(epRoot, 'package.json'), join(epOutput, 'package.json'))
}
