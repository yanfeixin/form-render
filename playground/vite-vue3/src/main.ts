import { createApp } from 'vue'
import App from './App.vue'
import { setupApp } from '@/setup'
import './utils/https'

createApp(App).use(setupApp).mount('#app')
