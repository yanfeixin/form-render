/*
 * @Description: 
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2024-01-02 08:35:12
 * @LastEditors: caohao
 * @LastEditTime: 2024-01-02 10:50:46
 */
import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';

import Demo from '../components/v-demo.vue';
import '../styles/app.scss';
import KingUI from "@king-one/antdv/components/button"
import "@king-one/theme-chalk/src/index.scss"
export default <Theme>{
  ...DefaultTheme,
  enhanceApp({ app }) {
    // register global components
    app.use(KingUI);
    app.component('Demo', Demo);
  },
};
