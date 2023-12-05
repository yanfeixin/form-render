/*
 * @Author: caohao
 * @Date: 2023-10-10 15:59:58
 * @LastEditors: caohao
 * @LastEditTime: 2023-10-16 11:30:57
 * @Description:
 */
import gulp from 'gulp'
import cleanCSS from 'gulp-clean-css'
import consola from 'consola'
import chalk from 'chalk'
import { pkThemeRoot, epOutThemeRoot } from '../../utils/paths'
// 打包配置
export const config = {
  input: pkThemeRoot,
  output: epOutThemeRoot,
}
// 复制字体
export const copyfont = () => gulp.src([`${config.input}fonts/*`, `!${config.input}fonts/*.css`]).pipe(gulp.dest(`${config.output}/fonts`))

// 压缩font 里的 CSS
export const minifontCss = () =>
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
