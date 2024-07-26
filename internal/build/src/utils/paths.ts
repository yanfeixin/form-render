import { resolve } from 'node:path'

export const projRoot = resolve(__dirname, '..', '..', '..', '..')
// dist
export const buildOutput = resolve(projRoot, 'dist')
export const buildRoot = resolve(projRoot, 'internal', 'dist')
