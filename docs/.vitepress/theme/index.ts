/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2023-12-27 14:56:39
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-28 15:04:26
 */
// https://vitepress.dev/guide/custom-theme
import type { Theme } from "vitepress"
import DefaultTheme from "vitepress/theme"
import KingUI from "@king-one/antdv/components/button"
import "@king-one/theme-chalk/src/index.scss"
import "../styles/app.scss"

export default <Theme>{
  ...DefaultTheme,
  enhanceApp({ app }) {
    // register global components
    app.use(KingUI)
  },
}
