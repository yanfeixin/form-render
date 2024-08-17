import { resolve } from 'node:path'
import { parallel } from 'gulp'
import { copyFile } from 'fs-extra'
import type { TaskFunction } from 'gulp'
import { buildConfig, getLibPath } from '../utils'
import type { Module } from '../utils'

export const copyRootTypesDefinitions: TaskFunction = (done) => {
  const { epRoot } = getLibPath()
  const src = resolve(epRoot, 'index.d.ts')
  const config = buildConfig()
  const copyTypes = (module: Module) =>
    Object.assign(() => copyFile(src, resolve(config[module].output.path, 'index.d.ts')), {
      displayName: `copyTypes:${module}`
    })

  return parallel(copyTypes('esm'), copyTypes('cjs'))(done)
}
