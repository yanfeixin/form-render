import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export function epPackage(pkgRoot: string) {
  return resolve(pkgRoot, 'package.json')
}

/**
 * 查找package.json dependencies peerDependencies 配置
 * @param pkgPath package.json路径
 * @returns {dependencies:{...},peerDependencies:{...}}
 */
export function getPackageDependencies(pkgPath: string): Record<'dependencies' | 'peerDependencies', string[]> {
  const manifest = readFileSync(pkgPath, { encoding: 'utf-8' })
  const { dependencies = {}, peerDependencies = {} } = JSON.parse(manifest)

  return {
    dependencies: Object.keys(dependencies),
    peerDependencies: Object.keys(peerDependencies)
  }
}

/**
 * 外部引入库标识，以防Rollup打包在一起
 * @param buildType 'node' | 'cdn'
 * @returns string[]
 */
export async function generateExternal(buildType: 'node' | 'cdn', pkgRoot: string) {
  const PackagePath = epPackage(pkgRoot)
  const { dependencies, peerDependencies } = getPackageDependencies(PackagePath)
  if (buildType === 'cdn') {
    return [...peerDependencies]
  }
  return [...dependencies, ...peerDependencies]
}
