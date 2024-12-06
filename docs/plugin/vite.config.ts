// vite.config.js

import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: './src/index.ts'
    },
    rollupOptions: {
      external: ['node:path', 'node:fs', 'markdown-it-container', 'markdown-it', 'node:crypto'],
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

    dts({
      outDir: 'dist/types'
    })
  ]
})
