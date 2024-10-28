import { resolve } from 'node:path'

export const projRoot = resolve(__dirname, '..', '..', '..', '..')
export const buildRoot = resolve(projRoot, 'internal', 'build')
export const buildEnv = resolve(buildRoot, 'env')
