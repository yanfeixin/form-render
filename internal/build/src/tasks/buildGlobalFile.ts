import fs from 'node:fs'
import path from 'node:path'
import consola from 'consola'
import { transformString } from '../utils'
// import { PKG_NAME, epOutput, pkgRoot } from '../utils/paths'

const excludeComponents: string[] = ['base', 'utils']

export async function buildGlobalTypeFile() {
  const pkgRoot = process.env.KING_COMPONENT_ROOT_PATH!
  const componentsDir = path.join(pkgRoot, 'components')
  const components = fs.readdirSync(componentsDir)

  const componentDeclarations = components
    .filter(componentName => !componentName.endsWith('.ts') && !excludeComponents.includes(componentName))
    .map(
      componentName =>
        `K${transformString(
          componentName,
          'upperCamelCase'
        )}: typeof import('@king-one/antdv')['K${transformString(componentName, 'upperCamelCase')}'];`
    )
    .join('\n    ')
  // eslint-disable-next-line no-console
  console.log('componentDeclarations', componentDeclarations)
  const content = `
// GlobalComponents for Volar
declare module 'vue' {
  export interface GlobalComponents {
    ${componentDeclarations}
  }
}

export {};
  `

  fs.writeFileSync(path.resolve(pkgRoot, 'global.d.ts'), content)
}
