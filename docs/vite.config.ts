/*
 * @Description: 
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2024-01-02 09:44:18
 * @LastEditors: caohao
 * @LastEditTime: 2024-01-02 11:12:14
 */
import path from "path"
import type { UserConfig } from "vite"
import Inspect from "vite-plugin-inspect"
import vueJsx from "@vitejs/plugin-vue-jsx"
import { VitePWA } from "vite-plugin-pwa"
import { MarkdownTransform } from "./.vitepress/plugins/markdown-transform"

export default (): UserConfig => {
  return {
    base: "comdocs",
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
      vueJsx(),
      Inspect(), // only applies in dev mode
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
