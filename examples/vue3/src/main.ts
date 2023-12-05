/*
 * @Author: caohao
 * @Date: 2023-12-05 09:53:34
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-05 19:33:12
 * @Description:
 */
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// import IceUI from '@ice-ui/build'
import IceUI from '@king-one/components'
import '@king-one/theme-chalk/src/index.scss'
const app = createApp(App)
app.use(IceUI)
app.mount('#app')
