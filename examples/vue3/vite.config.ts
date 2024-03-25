/*
 * @Author: caohao
 * @Date: 2023-12-06 20:01:10
 * @LastEditors: caohao
 * @LastEditTime: 2024-03-12 19:51:16
 * @Description:
 */
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3001,
  },
  plugins: [vue()],
})
