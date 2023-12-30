/*
 * @Author: caohao
 * @Date: 2023-12-26 11:06:08
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-31 01:47:28
 * @Description:
 */
import { defineConfig } from "vitepress"
import { sidebar } from "./config/navigation"
import nav from "./navigation/nav.json"
import { mdPlugin } from "./config/plugins"
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
  description: "A VitePress Site",
  // lastUpdated: true,
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.ico" }],
    [
      "link",
      {
        rel: "manifest",
        href: "/manifest.webmanifest",
      },
    ],
    [
      "script",
      {
        src: "/registerSW.js",
      },
    ],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/logo2.png",
    // nav: [
    //   { text: '首页', link: '/' },
    //   { text: '组件', link: '/markdown-examples' },
    // ],
    nav,
    // 展示搜索框
    search: {
      provider: "algolia",
      options: {
        appId: "SHDNEYGA8Z",
        apiKey: "91419401b0b0efd31b610e54e5b97249",
        indexName: "king-ui",
        searchParameters: ["ags:guide,api"],
      },
    },
    footer: {
      // message: 'Released under the MIT License.',
      copyright: "Copyright © 2023-present by caohao",
    },
    // search: {
    //   provider: 'local',
    // },
    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' },
    //     ],
    //   },
    // ],
    sidebar,
    socialLinks: [{ icon: "github", link: "https://github.com/vuejs/vitepress" }],
  },
  markdown: {
    config: (md) => mdPlugin(md),
  },
})
