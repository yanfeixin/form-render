/*
 * @Author: caohao
 * @Date: 2023-10-10 15:59:58
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-11-18 11:43:12
 * @Description:
 */
import gulp from 'gulp'
import cleanCSS from 'gulp-clean-css'
import consola from 'consola'
import chalk from 'chalk'
// 复制字体
export const copyfont = config => () => gulp.src([`${config.input}/src/fonts/*`, `!${config.input}/src/fonts/*.css`]).pipe(gulp.dest(`${config.output}/fonts`))

// 压缩font 里的 CSS
export function minifontCss(config) {
  return () =>
    gulp
      .src(`${config.input}fonts/*.css`)
      .pipe(
        cleanCSS({}, (details) => {
          consola.success(
            `${chalk.cyan(details.name)}: ${chalk.yellow(details.stats.originalSize / 1000)} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
          )
        })
      )
      .pipe(gulp.dest(`${config.output}/fonts`))
}
