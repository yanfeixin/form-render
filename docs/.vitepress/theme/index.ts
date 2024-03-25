/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2024-01-02 08:35:12
 * @LastEditors: caohao
 * @LastEditTime: 2024-03-25 13:42:10
 */
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

import Demo from '../components/v-demo.vue'
import '../styles/app.scss'
import KingUI from '@king-one/antdv'
// import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import '@king-one/theme-chalk/src/index.scss'
export default <Theme>{
  ...DefaultTheme,
  enhanceApp({ app }) {
    // register global components
    // app.use(Antd)
    app.use(KingUI)
    app.component('Demo', Demo)
  },
}
