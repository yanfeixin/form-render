/*
 * @Author: caohao
 * @Date: 2023-12-06 20:01:10
 * @LastEditors: caohao
 * @LastEditTime: 2024-04-23 14:57:57
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

  plugins: [
    nodePolyfills({
      // include: [
      //   '_stream_duplex',
      //   '_stream_passthrough',
      //   '_stream_readable',
      //   '_stream_transform',
      //   '_stream_writable',
      //   'assert',
      //   'buffer',
      //   'child_process',
      //   'cluster',
      //   'console',
      //   'constants',
      //   'crypto',
      //   'dgram',
      //   'dns',
      //   'domain',
      //   'events',
      //   'fs',
      //   'http',
      //   'http2',
      //   'https',
      //   'module',
      //   'net',
      //   'os',
      //   'path',
      //   'process',
      //   'punycode',
      //   'querystring',
      //   'readline',
      //   'repl',
      //   'stream',
      //   'string_decoder',
      //   'sys',
      //   'timers',
      //   'timers/promises',
      //   'tls',
      //   'tty',
      //   'url',
      //   'util',
      //   'vm',
      //   'zlib',
      // ],
      overrides: {
        // Since `fs` is not supported in browsers, we can use the `memfs` package to polyfill it.
        fs: 'memfs',
      },
    }),
    vue(),
  ],
})
