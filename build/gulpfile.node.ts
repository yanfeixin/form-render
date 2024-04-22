/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2023-10-04 01:03:22
 * @LastEditors: caohao
 * @LastEditTime: 2024-04-19 22:00:11
 */
import { deleteSync } from 'del'
import type { TaskFunction } from 'gulp'
import { series, parallel } from 'gulp'
import minimist from 'minimist'
import dotenv from 'dotenv'
// import { title } from './utils/message'
// import { buildOutput, buildRoot } from './utils/paths'
import { buildNodeModules, generateTypesDefinitions, title, buildOutput, buildRoot, copyComponentsPackages, setPkgRoot } from './src'
import { copyTypesDefinitions } from './src/tasks'
import { resolve } from 'node:path'

console.log(title('开始构建～～！'))
export const clean: TaskFunction = (done) => {
  deleteSync(buildOutput, { force: true })
  done()
}
export const loadEnv: TaskFunction = (done) => {
  const argvs = minimist(process.argv.slice(2))
  const { mode } = argvs
  const envPath = resolve(buildRoot, `.env${mode ? `.${mode}` : ``}`)
  dotenv.config({ path: envPath })
  setPkgRoot(process.env.PKG_ROOT_PATH)
  done()
}
export default series(clean, loadEnv, series(parallel(buildNodeModules), generateTypesDefinitions, parallel(copyTypesDefinitions, copyComponentsPackages)))
