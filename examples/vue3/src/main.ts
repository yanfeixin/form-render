/*
 * @Author: caohao
 * @Date: 2023-12-05 09:53:34
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-27 16:59:00
 * @Description:
 */
import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"
// import IceUI from '@ice-ui/build'
import KingUI from "@king-one/antdv"
import "@king-one/theme-chalk/src/index.scss"
const app = createApp(App)
app.use(KingUI)
app.mount("#app")
