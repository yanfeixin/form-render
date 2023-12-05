/*
 * @Author: caohao
 * @Date: 2023-03-26 17:28:16
 * @LastEditors: caohao
 * @LastEditTime: 2023-11-29 17:16:42
 * @Description:
 */
import { TaskFunction } from 'gulp'
// import chalk from 'chalk';
import { Project } from 'ts-morph'
import path from 'path'
import { mkdir, readFile } from 'fs/promises'
import glob from 'fast-glob' // 快速查找项目里的所有文件
import chalk from 'chalk'
import { copyFile } from 'fs-extra'
import { buildOutput, projRoot, pkgRoot, PKG_NAME, epRoot, epOutput } from '../utils/paths'
import consola from 'consola' // 终端打印输入
import type { CompilerOptions, SourceFile } from 'ts-morph' // ts编译api封装库。更方便的处理ts ast(抽象语法树)
const outDir = path.resolve(buildOutput, 'types') // 根目录下的 dist/types
const TSCONFIG_PATH = path.resolve(projRoot, 'tsconfig.web.json')
import * as vueCompiler from 'vue/compiler-sfc' // 提取sfc中的ts
import { excludeFiles } from './buildModules' // 忽略掉node_module 和__test__中的文件
export const generateTypesDefinitions: TaskFunction = async (cb) => {
  const compilerOptions: CompilerOptions = {
    emitDeclarationOnly: true,
    outDir,
    baseUrl: projRoot,
    preserveSymlinks: true,
    skipLibCheck: true,
    noImplicitAny: false,
  }
  const project = new Project({
    compilerOptions,
    tsConfigFilePath: TSCONFIG_PATH,
    skipAddingFilesFromTsConfig: true,
  })
  const sourceFiles = await addSourceFiles(project)
  consola.success('Added source files')
  typeCheck(project)
  consola.success('Type check passed!')
  const tasks = sourceFiles.map(async (sourceFile) => {
    const relativePath = path.relative(pkgRoot, sourceFile.getFilePath())

    consola.trace(chalk.yellow(`Generating definition for file: ${chalk.bold(relativePath)}`))

    if (relativePath === 'global.d.ts') {
      copyFile(sourceFile.getFilePath(), path.join(epOutput, relativePath))
    } else {
      const emitOutput = sourceFile.getEmitOutput()
      const emitFiles = emitOutput.getOutputFiles()
      if (emitFiles.length === 0) {
        throw new Error(`Emit no file: ${chalk.bold(relativePath)}`)
      }

      const subTasks = emitFiles.map(async (outputFile) => {
        const filepath = outputFile.getFilePath()

        await mkdir(path.dirname(filepath), {
          recursive: true,
        })

        consola.success(chalk.green(`Definition for file: ${chalk.bold(relativePath)} generated`))
      })

      await Promise.all(subTasks)
    }
  })

  await Promise.all(tasks)
  // 获取原始的ts文件 将其输出为js或者.d.ts声明文件
  await project.emit({
    emitOnlyDtsFiles: true,
  })
}

async function addSourceFiles(project: Project) {
  const globSourceFile = '**/*.{js?(x),ts?(x),vue}'
  const filePaths = excludeFiles(
    await glob([globSourceFile, `!${PKG_NAME}/**/*`], {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  )
  const epPaths = excludeFiles(
    await glob(globSourceFile, {
      cwd: epRoot,
      onlyFiles: true,
    })
  )

  const sourceFiles: SourceFile[] = []
  await Promise.all([
    ...filePaths.map(async (file) => {
      if (file.endsWith('.vue')) {
        const content = await readFile(file, 'utf-8')
        const hasTsNoCheck = content.includes('@ts-nocheck')

        const sfc = vueCompiler.parse(content)
        const { script, scriptSetup } = sfc.descriptor
        if (script || scriptSetup) {
          let content = (hasTsNoCheck ? '// @ts-nocheck\n' : '') + (script?.content ?? '')

          if (scriptSetup) {
            const compiled = vueCompiler.compileScript(sfc.descriptor, {
              id: 'xxx',
            })
            content += compiled.content
          }

          const lang = scriptSetup?.lang || script?.lang || 'js'
          const sourceFile = project.createSourceFile(`${path.relative(process.cwd(), file)}.${lang}`, content)
          sourceFiles.push(sourceFile)
        }
      } else {
        const sourceFile = project.addSourceFileAtPath(file)
        sourceFiles.push(sourceFile)
      }
    }),
    ...epPaths.map(async (file) => {
      const content = await readFile(path.resolve(epRoot, file), 'utf-8')
      sourceFiles.push(project.createSourceFile(path.resolve(pkgRoot, file), content))
    }),
  ])

  return sourceFiles
}
// 诊断ts编译中是否有语法错误
function typeCheck(project: Project) {
  const diagnostics = project.getPreEmitDiagnostics()
  if (diagnostics.length > 0) {
    consola.error(project.formatDiagnosticsWithColorAndContext(diagnostics))
    const err = new Error('Failed to generate dts.')
    consola.error(err)
    throw err
  }
}
