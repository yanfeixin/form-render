import path from 'path'
import { mkdir, readFile, writeFile, readdir } from 'fs/promises'
import consola from 'consola'
import * as vueCompiler from 'vue/compiler-sfc'
import glob from 'fast-glob'
import chalk from 'chalk'
import { Project } from 'ts-morph'

import type { CompilerOptions, SourceFile } from 'ts-morph'
// import { copyFile } from 'fs-extra';
import { buildOutput, pkgRoot, projRoot, getAntdvPath, getDirs } from '../utils/paths'
import { excludeFiles } from './buildModules'
const TSCONFIG_PATH = path.resolve(projRoot, 'tsconfig.web.json')
const outDir = path.resolve(buildOutput, 'types')
import { pathRewriter } from '../utils/pkg'
/**
 * https://github.com/egoist/vue-dts-gen/blob/main/src/index.ts
 */
export const generateTypesDefinitions = async () => {
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

  await project.emit({
    emitOnlyDtsFiles: true,
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
        recursive: true,
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
  const { epRoot, epOutput } = getAntdvPath()
  const dirs = await getDirs(path.resolve(epOutput, 'es'))
  const globSourceFile = dirs.map((dir) => `${dir}/**/*.{js?(x),ts?(x),vue}`)
  const filePaths = excludeFiles(
    await glob(globSourceFile, {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  )
  const epPaths = excludeFiles(
    await glob('**/*.{js?(x),ts?(x),vue}', {
      cwd: epRoot,
      onlyFiles: true,
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
              id: 'xxx',
            })
            content += compiled.content
          }
          const lang = scriptSetup?.lang || script?.lang || 'js'
          const sourceFile = project.createSourceFile(path.resolve(pkgRoot, `${file}.${lang}`), content)
          sourceFile
            .getImportDeclarations()
            .filter((declaration) => declaration.getModuleSpecifierValue() === 'ant-design-vue')
            .forEach((declaration) => declaration.remove())
          // const paksourceFile = project.createSourceFile(path.resolve(projRoot, 'node_modules', '@king-one/antdv', `${file}.${lang}`), content)
          // sourceFiles.push(paksourceFile)
          sourceFiles.push(sourceFile)
        }
      } else {
        sourceFiles.push(project.createSourceFile(path.resolve(pkgRoot, file), content))
      }
    }),
    // ...filePaths.map(async (file) => {
    //   const sourceFile = project.addSourceFileAtPath(file)
    //   sourceFiles.push(sourceFile)
    // }),
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
