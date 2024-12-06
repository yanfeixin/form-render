// vite.config.js
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: './src/index.ts'
    },
    rollupOptions: {
      external: ['vue'],
      output: [
        {
          dir: 'dist/es',
          entryFileNames: '[name].mjs',
          // 打包目录和开发目录对应
          preserveModules: true,
          format: 'es'
        },
        {
          dir: 'dist/lib',
          entryFileNames: '[name].js',
          // 打包目录和开发目录对应
          preserveModules: true,
          format: 'cjs'
        }
      ]
    }
  },
  plugins: [
    vue(),
    vueJsx({ optimize: true }),
    dts({
      outDir: 'dist/types'
    })
  ]
})
