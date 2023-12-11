/*
 * @Author: caohao
 * @Date: 2023-12-05 09:53:34
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-11 16:58:18
 * @Description:
 */
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// import IceUI from '@ice-ui/build'
// import IceUI from '@king-one/components'
import '@king-one/theme-chalk/src/index.scss'
const app = createApp(App)
import { aaa } from '@king-one/core'
console.log(aaa)
// app.use(IceUI)
app.mount('#app')
