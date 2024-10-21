import path from 'node:path'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import consola from 'consola'
import * as vueCompiler from 'vue/compiler-sfc'
import glob from 'fast-glob'
import chalk from 'chalk'
import { Project } from 'ts-morph'

import type { CompilerOptions, SourceFile } from 'ts-morph'
import { buildOutput, getDirs, getLibPath, pkgRoot, projRoot } from '../utils/paths'
import { pathRewriter } from '../utils/pkg'
import { excludeFiles } from './buildModules'

const TSCONFIG_PATH = path.resolve(projRoot, 'tsconfig.esnext.json')
const outDir = path.resolve(buildOutput, 'types')
/**
 * https://github.com/egoist/vue-dts-gen/blob/main/src/index.ts
 */
export async function generateTypesDefinitions() {
  const compilerOptions: CompilerOptions = {
    emitDeclarationOnly: true,
    outDir,
    baseUrl: projRoot,
    preserveSymlinks: true,
    skipLibCheck: true,
    noImplicitAny: false
  }
  const project = new Project({
    compilerOptions,
    tsConfigFilePath: TSCONFIG_PATH,
    skipAddingFilesFromTsConfig: true
  })

  const sourceFiles = await addSourceFiles(project)
  consola.success('Added source files')
  typeCheck(project)
  consola.success('Type check passed!')

  await project.emit({
    emitOnlyDtsFiles: true
  })

  const tasks = sourceFiles.map(async (sourceFile) => {
    const relativePath = path.relative(pkgRoot, sourceFile.getFilePath())
    consola.trace(chalk.yellow(`Generating definition for file: ${chalk.bold(relativePath)}`))

    const emitOutput = sourceFile.getEmitOutput()
    const emitFiles = emitOutput.getOutputFiles()
    if (emitFiles.length === 0) {
      throw new Error(`Emit no file: ${chalk.bold(relativePath)}`)
    }

    const subTasks = emitFiles.map(async (outputFile) => {
      const filepath = outputFile.getFilePath()
      await mkdir(path.dirname(filepath), {
        recursive: true
      })

      await writeFile(filepath, pathRewriter('esm')(outputFile.getText()), 'utf8')

      consola.success(chalk.green(`Definition for file: ${chalk.bold(relativePath)} generated`))
    })

    await Promise.all(subTasks)
  })

  await Promise.all(tasks)
}

async function addSourceFiles(project: Project) {
  // project.addSourceFileAtPath(path.resolve(projRoot, 'typings/env.d.ts'))
  const { epRoot, epOutput } = getLibPath()
  const dirs = await getDirs(path.resolve(epOutput, 'es'))
  const globSourceFile = dirs.map(dir => `${dir}/**/*.{js?(x),ts?(x),vue}`)
  const filePaths = excludeFiles(
    await glob(globSourceFile, {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true
    })
  )
  consola.warn(1)
  // eslint-disable-next-line no-console
  console.log(filePaths)
  const epPaths = excludeFiles(
    await glob('**/*.{js?(x),ts?(x),vue}', {
      cwd: epRoot,
      onlyFiles: true,
      ignore: ['**/style/**', '**/styles/**']
    })
  )

  const sourceFiles: SourceFile[] = []
  await Promise.all([
    ...epPaths.map(async (file) => {
      const content = await readFile(path.resolve(epRoot, file), 'utf-8')
      if (file.endsWith('.vue')) {
        const hasTsNoCheck = content.includes('@ts-nocheck')
        const sfc = vueCompiler.parse(content)
        const { script, scriptSetup } = sfc.descriptor
        if (script || scriptSetup) {
          let content = (hasTsNoCheck ? '// @ts-nocheck\n' : '') + (script?.content ?? '')
          if (scriptSetup) {
            const compiled = vueCompiler.compileScript(sfc.descriptor, {
              id: 'xxx'
            })
            content += compiled.content
          }
          const lang = scriptSetup?.lang || script?.lang || 'js'
          const sourceFile = project.createSourceFile(path.resolve(pkgRoot, `${file}.${lang}`), content)
          // sourceFile
          //   .getImportDeclarations()
          //   .filter(declaration => declaration.getModuleSpecifierValue() === 'ant-design-vue')
          //   .forEach(declaration => declaration.remove())
          sourceFiles.push(sourceFile)
        }
      }
      else {
        sourceFiles.push(project.createSourceFile(path.resolve(pkgRoot, file), content))
      }
      // let content = await readFile(path.resolve(epRoot, file), 'utf-8')
      // let filePath = path.resolve(pkgRoot, file)
      // // 不处理 .vue 文件
      // if (file.endsWith('.vue')) {
      //   content = 'export default {} as any' // 确保你得 .vue 文件只有一个默认导出 否则会报错
      //   filePath = path.resolve(pkgRoot, `${file}.ts`)
      // }
      // sourceFiles.push(project.createSourceFile(filePath, content))
    }),
    ...filePaths.map(async (file) => {
      const sourceFile = project.addSourceFileAtPath(file)
      sourceFiles.push(sourceFile)
    })
  ])

  return sourceFiles
}

function typeCheck(project: Project) {
  const diagnostics = project.getPreEmitDiagnostics()
  if (diagnostics.length > 0) {
    consola.error(project.formatDiagnosticsWithColorAndContext(diagnostics))
    const err = new Error('Failed to generate dts.')
    consola.error(err)
    throw err
  }
}
