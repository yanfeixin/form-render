import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { setupApp } from '@/setup'
import './utils/https'

createApp(App).use(setupApp).use(router).mount('#app')
