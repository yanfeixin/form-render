/*
 * @Author: caohao
 * @Date: 2023-10-12 10:02:50
 * @LastEditors: caohao
 * @LastEditTime: 2024-01-02 20:10:34
 * @Description:
 */
import path from 'node:path'
import { dest, parallel, src } from 'gulp'
import autoprefixer from 'gulp-autoprefixer'
import cleanCSS from 'gulp-clean-css'
import consola from 'consola'
import chalk from 'chalk'

// 基础方法
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import { getLibPath, pkThemeRoot, withTaskName } from '../../utils'
import { copyfont, minifontCss } from './gulpfile.base'

const sass = gulpSass(dartSass)

// 编译 SASS
function compile(config) {
  return () =>
    src(path.resolve(__dirname, `${config.input}/src/*.scss`))
      .pipe(sass())
      .pipe(
        autoprefixer({
          cascade: false
        })
      )
      .pipe(
        cleanCSS({}, (details) => {
          consola.success(
            `${chalk.cyan(details.name)}: ${chalk.yellow(details.stats.originalSize / 1000)} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
          )
        })
      )
      .pipe(dest(config.output))
}

export function buildTheme(done) {
  const { epOutThemeRoot } = getLibPath()
  // 打包配置
  const config = {
    input: pkThemeRoot,
    output: epOutThemeRoot
  }
  parallel(
    withTaskName('theme:compile', compile(config)),
    withTaskName('theme:copyfont', copyfont(config)),
    withTaskName('theme:minifontCss', minifontCss(config))
  )(done)
}
