import { resolve } from 'node:path'
import { remove } from 'fs-extra'
import type { TaskFunction } from 'gulp'
import { parallel, series } from 'gulp'
import minimist from 'minimist'
import dotenv from 'dotenv'
import { buildOutput, buildRoot, title } from './src/utils'
// eslint-disable-next-line no-console
console.log(title('开始构建～～！'))
export const clean: TaskFunction = async () => {
  return remove(buildOutput)
}
export const loadEnv: TaskFunction = (done) => {
  const argvs = minimist(process.argv.slice(2))

  const { mode } = argvs
  const envPath = resolve(buildRoot, `.env${mode ? `.${mode}` : ``}`)
  dotenv.config({ path: envPath })
  done()
}
export default series(
  // runTask('testModel'),
  clean,
  loadEnv
)
