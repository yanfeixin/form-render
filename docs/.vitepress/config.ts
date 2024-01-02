/*
 * @Description: 
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2024-01-02 09:44:34
 * @LastEditors: caohao
 * @LastEditTime: 2024-01-02 11:07:09
 */
import type { UserConfig } from 'vitepress';

import { mdPlugin } from './config/plugins';
import { sidebar } from './config/navigation';

import nav from './navigation/nav.json';

const config: UserConfig = {
  lang: 'zh-CN',
  title: "My Awesome Project",
  description: "A VitePress Site",
  head: [
    [
      "link", 
      { rel: "icon", type: "image/svg+xml", href: "/pwa/favicon.ico" }
    ],
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
    logo: '/logo2.png',
    // 展示搜索框
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
    socialLinks: [{ icon: "github", link: "https://github.com/vuejs/vitepress" }],
    // 顶部标题栏
    nav,
    // 侧边栏
    sidebar,
  },
  markdown: {
    config: (md: markdownit) => mdPlugin(md),
  },
};

export default config;
