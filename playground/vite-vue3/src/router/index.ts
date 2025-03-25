import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/App-demo.vue')
  },
  {
    path: '/flow-designer',
    component: () => import('@/views/flow-designer.vue')
  },
  {
    path: '/table-filter',
    component: () => import('@/views/table-filter.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
