/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2024-09-16 16:54:56
 * @LastEditors: caohao
 * @LastEditTime: 2024-09-17 00:42:05
 */
import { resolve } from 'node:path'
import { remove } from 'fs-extra'
import type { TaskFunction } from 'gulp'
import { parallel, series } from 'gulp'
import minimist from 'minimist'
import dotenv from 'dotenv'
import { buildEnv, buildOutput, setPkgRoot, title } from './src/utils'
import { buildCdnModules, buildNodeModules, buildTheme, copyComponentsPackages, copyThemeCdn, copyTypesDefinitions, generateTypesDefinitions } from './src/tasks'

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
export default series(
  // runTask('testModel'),
  clean,
  loadEnv,
  buildTheme,
  parallel(buildCdnModules, buildNodeModules),
  generateTypesDefinitions,
  parallel(copyTypesDefinitions, copyThemeCdn, copyComponentsPackages)
)
