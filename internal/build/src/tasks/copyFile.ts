/*
 * @Author: caohao
 * @Date: 2023-12-11 14:46:53
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-08-17 20:46:25
 * @Description:
 */
import { join, resolve } from 'node:path'
import { copy, copyFile } from 'fs-extra'
import type { TaskFunction } from 'gulp'
import { parallel } from 'gulp'
import { buildConfig, buildOutput, getLibPath } from '../utils'
import type { Module } from '../utils'

export const copyTypesDefinitions: TaskFunction = (done) => {
  const src = resolve(buildOutput, 'types', process.env.PKG_ROOT_PATH as string)
  const config = buildConfig()
  const copyTypes = (module: Module) =>
    Object.assign(() => copy(src, config[module].output.path), {
      displayName: `copyTypes:${module}`
    })

  return parallel(copyTypes('esm'), copyTypes('cjs'))(done)
}
export function copyThemeCdn() {
  const { epOutput, epOutputCdn } = getLibPath()
  return copyFile(resolve(epOutput, 'theme-chalk', 'index.css'), join(epOutputCdn, 'index.css'))
}
export function copyComponentsPackages() {
  const { epRoot, epOutput } = getLibPath()
  return copyFile(resolve(epRoot, 'package.json'), join(epOutput, 'package.json'))
}
