/*
 * @Author: caohao
 * @Date: 2023-11-28 09:21:56
 * @LastEditors: caohao
 * @LastEditTime: 2023-11-28 09:22:05
 * @Description:
 */
import { spawn } from 'child_process'
import { projRoot } from './paths'
export const run = async (command: string, cwd: string = projRoot) =>
  new Promise<void>((resolve, reject) => {
    const [cmd, ...args] = command.split(' ')
    const app = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })

    const onProcessExit = () => app.kill('SIGHUP')

    app.on('close', (code) => {
      process.removeListener('exit', onProcessExit)

      if (code === 0) resolve()
      else reject(new Error(`Command failed. \n Command: ${command} \n Code: ${code}`))
    })
    process.on('exit', onProcessExit)
  })
