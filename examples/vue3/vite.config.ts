/*
 * @Author: caohao
 * @Date: 2023-12-06 20:01:10
 * @LastEditors: caohao
 * @LastEditTime: 2024-04-19 15:31:10
 * @Description:
 */
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3001,
    proxy: {
      '/api/': {
        target: 'http://192.168.2.134:9872',
        ws: false,
        changeOrigin: true,
        rewrite: (path) => path.replace('/api', ''),
      },
    },
  },

  plugins: [nodePolyfills(), vue()],
})
