/*
 * @Author: caohao
 * @Date: 2023-11-28 09:21:56
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-23 14:31:37
 * @Description:
 */
import { spawn } from 'node:child_process'
import type { TaskFunction } from 'gulp'
import { projRoot } from './paths'

export function withTaskName<T extends TaskFunction>(name: string, fn: T) {
  return Object.assign(fn, { displayName: name })
}
export async function run(command: string, cwd: string = projRoot) {
  return new Promise<void>((resolve, reject) => {
    const [cmd, ...args] = command.split(' ')
    const app = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32'
    })

    const onProcessExit = () => app.kill('SIGHUP')

    app.on('close', (code) => {
      process.removeListener('exit', onProcessExit)

      if (code === 0) {
        resolve()
      }
      else {
        reject(
          new Error(`Command failed. \n Command: ${command} \n Code: ${code}`)
        )
      }
    })
    process.on('exit', onProcessExit)
  })
}
