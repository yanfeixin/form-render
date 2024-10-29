import { resolve } from 'node:path'
import { select } from '@inquirer/prompts'
import { getPackages } from '@manypkg/get-packages'
import dotenv from 'dotenv'
import { series } from 'gulp'
import { buildModules, buildTheme, removeDist } from './src/tasks'
import { buildEnv } from './src/utils/paths'

const unBuildLibs = ['@king-one/antdv-docs', '@king-one/shared-docs', '@king-one/build', '@king-one/resolver', '@king-one/tapable', '@king-one/theme-chalk']
async function choiceLib() {
  const { packages } = await getPackages(process.cwd())

  const choices = packages.map(pkg => ({
    name: pkg.packageJson.name,
    value: pkg.dir
  }))

  const answer = await select({
    message: '请选择要构建的项目',
    choices: choices.filter(item => !unBuildLibs.includes(item.name))
  })
  const packageJson = packages.find(item => item.dir === answer)?.packageJson
  const env = (packageJson as any)?.custom?.env
  if (env) {
    const envPath = resolve(buildEnv, `.env${env ? `.${env}` : ``}`)
    if (envPath)
      dotenv.config({ path: envPath })
  }
  process.env.KING_COMPONENT_ROOT_PATH = answer
}
function buildProject(done) {
  if (process.env.KING_BUILD_THEME) {
    series(buildModules, buildTheme)(done)
  }
  else {
    series(buildModules)(done)
  }
}

export default series(choiceLib, removeDist, buildProject)
