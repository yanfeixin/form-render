/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2024-09-16 16:54:56
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-10-20 01:09:56
 */
import { resolve } from 'node:path'
import type { TaskFunction } from 'gulp'
import { parallel, series } from 'gulp'
import minimist from 'minimist'
import dotenv from 'dotenv'
import { buildEnv, setPkgRoot, title } from './src/utils'
import { buildCdnModules, buildNodeModules, buildTheme, clean, copyThemeCdn, copyTypesDefinitions, generateTypesDefinitions } from './src/tasks'

// eslint-disable-next-line no-console
console.log(title('开始构建～～！'))

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
  loadEnv,
  clean,
  buildTheme,
  parallel(buildCdnModules, buildNodeModules),
  generateTypesDefinitions,
  parallel(copyTypesDefinitions, copyThemeCdn)
)
