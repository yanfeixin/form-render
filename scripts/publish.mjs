import { getPackages } from '@manypkg/get-packages'
import { select,  } from '@inquirer/prompts';
import { spawn } from "child_process"
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
    // 获取 name 属性值
    const { packages } = await getPackages(process.cwd())
    const choices = packages.map(pkg => ({
        name: pkg.packageJson.name,
        value: pkg.dir
    }))
     const answer = await select({
        message: '选择要发布的项目',
        choices: choices
      });
    await run('pnpm publish --no-git-checks', answer)
}
await getPkgDirPath()