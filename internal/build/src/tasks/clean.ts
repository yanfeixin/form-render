import { remove } from 'fs-extra'
import type { TaskFunction } from 'gulp'
import { buildOutput, getDirs, getLibPath, pkgRoot, projRoot } from '../utils/paths'

export const clean: TaskFunction = async () => {
  const { epOutput } = getLibPath()
  await remove(epOutput)
  await remove(buildOutput)
}
