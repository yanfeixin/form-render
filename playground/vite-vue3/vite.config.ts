import { resolve } from 'node:path'
import type { ConfigEnv } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'

export const pathResolve = (dir: string) => resolve(__dirname, '.', dir)
// eslint-disable-next-line unused-imports/no-unused-vars
export default defineConfig(({ mode }: ConfigEnv) => {
  return {
    plugins: [vue(), vueJsx({ optimize: true })],
    resolve: {
      alias: {
        '@': pathResolve('src'),
        '-': pathResolve('')
      }
    },
    server: {
      host: '0.0.0.0',
      open: true,
      proxy: {
        '/api/': {
          target: 'http://192.168.2.134:8091',
          ws: false,
          changeOrigin: true,
          rewrite: path => path.replace('/api', '')
        }
      }
    }
  }
})
