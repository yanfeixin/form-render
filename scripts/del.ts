/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2023-10-03 10:50:23
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-07-23 17:05:51
 */
import fg from 'fast-glob'
import { remove } from 'fs-extra'
import { spinner } from '../internal/build'
const handleRemove = async () => {
  await new Promise((res) => setTimeout(res, 2000))
  const nodeModulesPaths = await fg('**/node_modules', { onlyDirectories: true })
  await Promise.all(nodeModulesPaths.map((path) => remove(path)))
}
const removeNodeModules = async () => {
  await spinner({
    start: `remove node_modules in progress..`,
    end: `node_modules clear`,
    while: () => handleRemove(), //'pnpm-lock.yaml'
  })
}
removeNodeModules()
