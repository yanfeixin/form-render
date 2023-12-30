/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2023-12-29 09:49:05
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-31 00:48:52
 */
import path from "path"
import type { UserConfig } from "vite"
import Inspect from "vite-plugin-inspect"
import { VitePWA } from "vite-plugin-pwa"
import { MarkdownTransform } from "./.vitepress/plugins/markdown-transform"
export default (): UserConfig => {
  return {
    resolve: {
      alias: [
        {
          find: "~/",
          replacement: `${path.resolve(__dirname, "./.vitepress")}/`,
        },
      ],
    },
    server: {
      host: true,
    },
    plugins: [
      Inspect(),
      MarkdownTransform(),
      VitePWA({
        includeAssets: ["favicon.svg", "favicon.ico", "robots.txt", "apple-touch-icon.png"],
        manifest: {
          name: "My Awesome Project",
          short_name: "风起于青萍之末",
          description: "Answer Explanation All",
          theme_color: "#ffffff",
          icons: [
            {
              src: "/pwa/android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/pwa/android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "/pwa/android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
      }),
    ],
  }
}
