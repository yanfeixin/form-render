/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2023-10-03 10:50:23
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-05 15:29:30
 */
import { deleteAsync } from 'del'
import { spinner } from '../build/src'
const handleRemove = async () => {
  await new Promise((res) => setTimeout(res, 2000))
  deleteAsync(['node_modules', '*/**/node_modules'])
}
const removeNodeModules = async () => {
  await spinner({
    start: `remove node_modules in progress..`,
    end: `node_modules clear`,
    while: () => handleRemove(), //'pnpm-lock.yaml'
  })
}
removeNodeModules()
