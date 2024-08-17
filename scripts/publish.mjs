import { getPackages } from '@manypkg/get-packages'
import { resolve } from 'node:path'
import { readdirSync, readFileSync, copyFileSync } from 'node:fs'
import { spawn } from "child_process"
const DistRoot = resolve(process.cwd(), 'dist')

const run = async (command, cwd = DistRoot) =>
    new Promise((resolve, reject) => {
        const [cmd, ...args] = command.split(" ")
        const app = spawn(cmd, args, {
            cwd,
            stdio: "inherit",
            shell: process.platform === "win32",
        })

        const onProcessExit = () => app.kill("SIGHUP")

        app.on("close", (code) => {
            process.removeListener("exit", onProcessExit)

            if (code === 0) resolve()
            else
                reject(
                    new Error(`Command failed. \n Command: ${command} \n Code: ${code}`)
                )
        })
        process.on("exit", onProcessExit)
    })
const getPkgDirPath = async () => {
    const pkgdir = readdirSync(DistRoot)[0]
    const pkgPath = resolve(DistRoot, pkgdir)
    const data = readFileSync(resolve(pkgPath, 'package.json'), 'utf8');

    // 解析 JSON 数据
    const packageJson = JSON.parse(data);

    // 获取 name 属性值
    const name = packageJson.name;
    const { packages } = await getPackages(process.cwd())
    const workDir = packages.find((pkg) => pkg.packageJson.name === name);
    const workLogPath = resolve(workDir.dir, 'CHANGELOG.md')
    const pkgLogPaht = resolve(pkgPath, 'CHANGELOG.md')
    copyFileSync(workLogPath, pkgLogPaht)
    await run('pnpm publish --access public', pkgPath)
}
await getPkgDirPath()