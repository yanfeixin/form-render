/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2023-10-04 01:03:22
 * @LastEditors: caohao
 * @LastEditTime: 2024-04-19 16:35:19
 */
import { deleteSync } from 'del'
import type { TaskFunction } from 'gulp'
import { series, parallel } from 'gulp'
import minimist from 'minimist'
import dotenv from 'dotenv'
// import { title } from './utils/message'
// import { buildOutput, buildRoot } from './utils/paths'
import {
  buildCdnModules,
  buildNodeModules,
  buildTheme,
  generateTypesDefinitions,
  run,
  title,
  buildOutput,
  buildRoot,
  withTaskName,
  copyThemeCdn,
  copyComponentsPackages,
  setPkgRoot,
} from './src'
import { copyTypesDefinitions } from './src/tasks'
import { resolve } from 'node:path'

console.log(title('开始构建～～！'))
export const clean: TaskFunction = (done) => {
  //   console.log(title("Starting!"))
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

export const runTask = (name: string) =>
  withTaskName(`shellTask:${name}`, () => {
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     console.log(111)
    //     resolve(true)
    //   }, 1000)
    // })
    return run(`pnpm run build ${name}`, buildRoot)
  })
export const testModel = async () => {
  console.log(111)
}
const buildProject = (done) => {
  if (process.env.PKG_THEME_BUILD === '1') {
    series(
      buildTheme,
      parallel(buildCdnModules, buildNodeModules),
      generateTypesDefinitions,
      parallel(copyTypesDefinitions, copyThemeCdn, copyComponentsPackages)
    )(done)
  } else {
    // buildCdnModules
    series(parallel(buildNodeModules), generateTypesDefinitions, parallel(copyTypesDefinitions, copyComponentsPackages))(done)
  }
}
//  parallel(copyTypesDefinitions)
export default series(
  // runTask('testModel'),
  clean,
  loadEnv,
  buildProject
)
