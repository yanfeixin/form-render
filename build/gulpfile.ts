/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2023-10-04 01:03:22
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-18 09:59:01
 */
import { deleteSync } from 'del'
import type { TaskFunction } from 'gulp'
import { series, parallel } from 'gulp'
// import { title } from './utils/message'
// import { buildOutput, buildRoot } from './utils/paths'
import { buildCdnModules, buildNodeModules, buildTheme, generateTypesDefinitions, run, title, buildOutput, buildRoot } from './src'
import { copyTypesDefinitions } from './src/tasks'
// import { buildTheme } from './tasks/theme/gulpfile.prod'
// import { run } from './utils/process'
// import { generateTypesDefinitions } from './tasks/typeExport'
console.log(title('开始构建～～！'))
export const clean: TaskFunction = (done) => {
  //   console.log(title("Starting!"))
  deleteSync(buildOutput, { force: true })
  done()
}
export const withTaskName = <T extends TaskFunction>(name: string, fn: T) => Object.assign(fn, { displayName: name })
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
//  parallel(copyTypesDefinitions)
export default series(clean, buildTheme, parallel(buildCdnModules, buildNodeModules))
