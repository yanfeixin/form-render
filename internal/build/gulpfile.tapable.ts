/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2023-10-04 01:03:22
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-08-17 22:05:55
 */
import { resolve } from 'node:path'
import { remove } from 'fs-extra'
import type { TaskFunction } from 'gulp'
import { parallel, series } from 'gulp'
import minimist from 'minimist'
import dotenv from 'dotenv'

import { buildEnv, buildOutput, setPkgRoot, title } from './src/utils'
import { buildNodeModules, copyComponentsPackages, copyRootTypesDefinitions } from './src/tasks'
// eslint-disable-next-line no-console
console.log(title('开始构建～～！'))
export const clean: TaskFunction = async () => {
  return remove(buildOutput)
}
export const loadEnv: TaskFunction = (done) => {
  const argvs = minimist(process.argv.slice(2))

  const { mode } = argvs
  const envPath = resolve(buildEnv, `.env${mode ? `.${mode}` : ``}`)
  dotenv.config({ path: envPath })
  setPkgRoot(process.env.PKG_ROOT_PATH as string)
  done()
}
export default series(clean, loadEnv, series(parallel(buildNodeModules), parallel(copyRootTypesDefinitions, copyComponentsPackages)))
