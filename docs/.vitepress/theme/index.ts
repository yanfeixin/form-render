/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2023-12-27 14:56:39
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-27 18:25:13
 */
// https://vitepress.dev/guide/custom-theme
import KingUI from "@king-one/antdv"
import "@king-one/theme-chalk/src/index.scss"
import { h } from "vue"
import type { Theme } from "vitepress"
import DefaultTheme from "vitepress/theme"
import "./style.css"

export default <Theme>{
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.use(KingUI)
    // ...
  },
}
