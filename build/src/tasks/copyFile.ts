/*
 * @Author: caohao
 * @Date: 2023-12-11 14:46:53
 * @LastEditors: caohao
 * @LastEditTime: 2024-05-16 16:07:05
 * @Description:
 */
import { resolve, join } from 'path'
import { copy, copyFile } from 'fs-extra'
import type { TaskFunction } from 'gulp'
import { parallel } from 'gulp'
import { buildOutput, buildConfig, getAntdvPath } from '../utils'
import type { Module } from '../utils'
export const copyTypesDefinitions: TaskFunction = (done) => {
  if (process.env.GENERATE_TYPE_DEFINITIONS === '0') {
    done()
    return
  }
  const src = resolve(buildOutput, 'types', process.env.PKG_ROOT_PATH)
  const config = buildConfig()
  const copyTypes = (module: Module) =>
    Object.assign(() => copy(src, config[module].output.path), {
      displayName: `copyTypes:${module}`
    })

  return parallel(copyTypes('esm'), copyTypes('cjs'))(done)
}
export const copyThemeCdn = () => {
  const { epOutput, epOutputCdn } = getAntdvPath()
  return copyFile(resolve(epOutput, 'theme-chalk', 'index.css'), join(epOutputCdn, 'index.css'))
}
export const copyComponentsPackages = () => {
  const { epRoot, epOutput } = getAntdvPath()
  return copyFile(resolve(epRoot, 'package.json'), join(epOutput, 'package.json'))
}
