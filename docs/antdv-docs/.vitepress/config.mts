import { defineConfig } from 'vitepress'

import { VitePWA } from 'vite-plugin-pwa'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { componentPreview, containerPreview } from '../../shared-docs/src/plugins'
import { demoPreviewGroupPlugin } from '../../shared-docs/src/plugins/compoentGroup'

export default defineConfig({
  title: '@king-one/antdv',
  description: 'A VitePress Site',
  head: [
    [
      'link',
      {
        rel: 'manifest',
        href: '/manifest.webmanifest'
      }
    ]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      {
        text: '相关链接',
        items: [
          { text: '@king-one/use', link: 'https://www.npmjs.com/package/@king-one/use' },
          { text: '@king-one/utils', link: 'https://www.npmjs.com/package/@king-one/utils' }
        ]
      }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
      {
        text: 'Basics 基础组件',
        items: [
          { text: 'Modal 对话框', link: '/components/modal' },
          { text: 'Scrollbar 滚动条', link: '/components/scroll-bar' },
          { text: 'ProTitle 标题', link: '/components/pro-title' },
          { text: 'VirtualList 虚拟列表', link: '/components/virtual-list' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    search: {
      provider: 'local'
    }
  },
  markdown: {
    config: (md) => {
      md.use(containerPreview)
      md.use(componentPreview)
      md.use(demoPreviewGroupPlugin)
    },
    // catppuccin-latte material-theme-lighter one-light
    theme: { light: 'github-light', dark: 'one-dark-pro' }
  },
  vite: {
    server: {
      port: 9001,
      host: '0.0.0.0'
    },
    plugins: [
      vueJsx(),
      VitePWA({
        includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'My Awesome Project',
          short_name: '风起于青萍之末',
          description: 'Answer Explanation All',
          theme_color: '#ffffff',
          icons: [
            {
              src: '/pwa/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/pwa/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: '/pwa/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ]
  }
})
