// .vitepress/config.mts
import { defineConfig } from "file:///Users/caohao/work/plugins/yanxin/king-one-v5/node_modules/.pnpm/vitepress@1.3.3_@algolia+client-search@5.0.0_@types+node@22.4.0_axios@1.7.5_sass@1.77.8_searc_qlwzroz3q5j32hov7tcrfqayyi/node_modules/vitepress/dist/node/index.js";
import { VitePWA } from "file:///Users/caohao/work/plugins/yanxin/king-one-v5/node_modules/.pnpm/vite-plugin-pwa@0.20.1_vite@5.4.1_workbox-build@7.1.1_workbox-window@7.1.0/node_modules/vite-plugin-pwa/dist/index.js";
import vueJsx from "file:///Users/caohao/work/plugins/yanxin/king-one-v5/node_modules/.pnpm/@vitejs+plugin-vue-jsx@4.0.1_vite@5.4.1_vue@3.4.38/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";

// ../shared-docs/src/plugins/utils.ts
var isCheckPreviewCom1 = /^<preview (.*)><\/preview>$/;
var isCheckPreviewCom2 = /^<preview (.*) \/>$/;
var isCheckContainerPreview = /^demo-preview=(.+)$/;
var scriptLangTsRE = /<\s*script[^>]*\blang=['"]ts['"][^>]*/;
var scriptSetupRE = /<\s*script[^>]*\bsetup\b[^>]*/;
var scriptSetupCommonRE = /<\s*script\s+(?:(setup|lang='ts'|lang="ts")\s*)?(setup|lang='ts'|lang="ts")?\s*>/;
function handleComponentName(componentName) {
  let newName = componentName;
  newName = newName.replaceAll(/[_|-]+(\w)/g, ($0, $1) => {
    return $1.toUpperCase();
  });
  return newName;
}
function injectComponentImportScript(env, path, componentName) {
  const scriptsCode = env.sfcBlocks.scripts;
  const scriptsSetupIndex = scriptsCode.findIndex((script) => {
    if (scriptSetupRE.test(script.tagOpen) || scriptLangTsRE.test(script.tagOpen))
      return true;
    return false;
  });
  const _componentName = handleComponentName(componentName);
  if (scriptsSetupIndex === -1) {
    const scriptBlockObj = {
      type: "script",
      tagClose: "</script>",
      tagOpen: "<script setup lang='ts'>",
      content: `<script setup lang='ts'>
        import ${_componentName} from '${path}'
        </script>`,
      contentStripped: `import ${_componentName} from '${path}'`
    };
    scriptsCode.push(scriptBlockObj);
  } else {
    const oldScriptsSetup = scriptsCode[0];
    if (oldScriptsSetup.content.includes(path) && oldScriptsSetup.content.includes(_componentName)) {
      scriptsCode[0].content = oldScriptsSetup.content;
    } else {
      const scriptCodeBlock = '<script lang="ts" setup>\n';
      scriptsCode[0].content = scriptsCode[0].content.replace(scriptSetupCommonRE, scriptCodeBlock);
      scriptsCode[0].content = scriptsCode[0].content.replace(
        scriptCodeBlock,
        `<script setup>

      import ${_componentName} from '${path}'
`
      );
    }
  }
}
function transformHighlightCode(mdInstance, sourceCode, suffix) {
  return mdInstance.options.highlight(sourceCode, suffix, "");
}
function composeComponentName(path) {
  let isFlag = true;
  let componentList = [];
  while (isFlag) {
    const lastIndex = path.lastIndexOf("/");
    if (lastIndex === -1) {
      isFlag = false;
    } else {
      const name = path.substring(lastIndex + 1);
      componentList.unshift(name);
      path = path.substring(0, lastIndex);
    }
  }
  componentList = componentList.filter((item) => item !== "" && item !== "." && item !== "..");
  return componentList.join("-").split(".")[0];
}
function isCheckingRelativePath(path) {
  const relativePath = path;
  if (relativePath.startsWith("./") || relativePath.startsWith("../") || relativePath.startsWith("/"))
    return relativePath;
  return `./${relativePath}`;
}

// ../shared-docs/src/plugins/componentPreview.ts
import { dirname, resolve } from "node:path";
import { readFileSync } from "node:fs";
var titleRegex = /title=['"](.*?)['"]/;
var pathRegex = /path=['"](.*?)['"]/;
var descriptionRegex = /description=['"](.*?)['"]/;
function transformPreview(md, token, env) {
  const componentProps = {
    path: "",
    title: "\u9ED8\u8BA4\u6807\u9898",
    description: "\u63CF\u8FF0\u5185\u5BB9"
  };
  const titleValue = token.content.match(titleRegex);
  const pathRegexValue = token.content.match(pathRegex);
  const descriptionRegexValue = token.content.match(descriptionRegex);
  if (!pathRegexValue)
    throw new Error("@vitepress-demo-preview/plugin: path is a required parameter");
  componentProps.path = isCheckingRelativePath(pathRegexValue[1]);
  componentProps.title = titleValue ? titleValue[1] : "";
  componentProps.description = descriptionRegexValue ? descriptionRegexValue[1] : "";
  const componentPath = resolve(dirname(env.path), componentProps.path || ".");
  const componentName = composeComponentName(componentProps.path);
  const suffixName = componentPath.substring(componentPath.lastIndexOf(".") + 1);
  injectComponentImportScript(env, componentProps.path, componentName);
  const componentSourceCode = readFileSync(componentPath, {
    encoding: "utf-8"
  });
  const compileHighlightCode = transformHighlightCode(md, componentSourceCode, suffixName);
  const code = encodeURI(componentSourceCode);
  const showCode = encodeURIComponent(compileHighlightCode);
  const sourceCode = `<demo-preview title="${componentProps.title}" description="${componentProps.description}" code="${code}" showCode="${showCode}" suffixName="${suffixName}" absolutePath="${componentPath}" relativePath="${componentProps.path}">
    <${componentName}></${componentName}>
  </demo-preview>`;
  return sourceCode;
}

// ../shared-docs/src/plugins/containerPreview.ts
import { dirname as dirname2, resolve as resolve2 } from "node:path";
import { readFileSync as readFileSync2 } from "node:fs";
import markdownItContainer from "file:///Users/caohao/work/plugins/yanxin/king-one-v5/node_modules/.pnpm/markdown-it-container@4.0.0/node_modules/markdown-it-container/index.mjs";
var validateContainerRE = /^preview.*$/;
var parseContainerParamRE = /^preview\s?(.*?)(?:\s\|\|\s(.*))?$/;
function containerDirectiveMount(md) {
  md.use(markdownItContainer, "preview", {
    marker: ":",
    validate: (params) => {
      const validateContainer = params.trim().match(validateContainerRE);
      if (validateContainer && validateContainer.length !== 0)
        return true;
      return false;
    }
  });
}
function parseContainerTag(md) {
  const defaultContainerPreviewOpenRender = md.renderer.rules.container_preview_open;
  md.renderer.rules.container_preview_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const componentRelativePath = isCheckingRelativePath(tokens[idx + 2].content.split("=")[1]);
    const componentPath = resolve2(dirname2(env.path), componentRelativePath || ".");
    const suffixName = componentPath.substring(componentPath.lastIndexOf(".") + 1);
    const componentSourceCode = readFileSync2(componentPath, {
      encoding: "utf-8"
    });
    const compileHighlightCode = transformHighlightCode(md, componentSourceCode, suffixName);
    const code = encodeURI(componentSourceCode);
    const showCode = encodeURIComponent(compileHighlightCode);
    const getParamArr = tokens[idx].info.trim().match(parseContainerParamRE);
    const title = getParamArr && getParamArr[1] ? getParamArr[1] : "";
    const description = getParamArr && getParamArr[2] ? getParamArr[2] : "";
    if (token.nesting === 1)
      return `<demo-preview title='${title}' description='${description}' code="${code}" showCode="${showCode}" suffixName="${suffixName}" absolutePath="${componentPath}" relativePath="${componentRelativePath}">
<template #code>${md.render("```vue \n" + componentSourceCode + "```")}</template>`;
    return defaultContainerPreviewOpenRender(tokens, idx, options, env, self);
  };
  const defaultContainerPreviewCloseRender = md.renderer.rules.container_preview_close;
  md.renderer.rules.container_preview_close = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    if (token.nesting === -1)
      return `</demo-preview>
`;
    return defaultContainerPreviewCloseRender(tokens, idx, options, env, self);
  };
}
function parseContainer(md) {
  const defaultHtmlTextRender = md.renderer.rules.text;
  md.renderer.rules.text = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    if (token.type === "text" && token.content.match(isCheckContainerPreview)) {
      const componentRelativePath = isCheckingRelativePath(token.content.match(isCheckContainerPreview)[1]);
      const componentName = composeComponentName(componentRelativePath);
      injectComponentImportScript(env, componentRelativePath, componentName);
      return `<${componentName}></${componentName}>`;
    }
    return defaultHtmlTextRender(tokens, idx, options, env, self);
  };
}

// ../shared-docs/src/plugins/index.ts
function componentPreview(md) {
  const defaultHtmlInlineRender = md.renderer.rules.html_inline;
  md.renderer.rules.html_inline = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    if (isCheckPreviewCom1.test(token.content) || isCheckPreviewCom2.test(token.content)) {
      return transformPreview(md, token, env);
    }
    return defaultHtmlInlineRender(tokens, idx, options, env, self);
  };
}
function containerPreview(md) {
  containerDirectiveMount(md);
  parseContainerTag(md);
  parseContainer(md);
}

// ../shared-docs/src/plugins/compoentGroup.ts
import crypto from "node:crypto";
import { readdirSync } from "node:fs";
import { join, dirname as dirname3 } from "node:path";
var rawPathRegexp = (
  // eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/strict
  /^(.+?(?:\.([\da-z]+))?)(#[\w-]+)?(?: ?{(\d+(?:[,-]\d+)*)? ?(\S+)?})? ?(?:\[(.+)])?$/
);
function rawPathToToken(rawPath) {
  const [
    filepath = "",
    extension = "",
    region = "",
    lines = "",
    lang = "",
    rawTitle = ""
  ] = (rawPathRegexp.exec(rawPath) || []).slice(1);
  const title = rawTitle || filepath.split("/").pop() || "";
  return { extension, filepath, lang, lines, region, title };
}
var demoPreviewGroupPlugin = (md) => {
  md.core.ruler.after("inline", "demo-preview", (state) => {
    const insertComponentImport = (importString) => {
      const index = state.tokens.findIndex(
        (i) => i.type === "html_block" && i.content.match(/<script setup>/g)
      );
      if (index === -1) {
        const importComponent = new state.Token("html_block", "", 0);
        importComponent.content = `<script setup>
${importString}
</script>
`;
        state.tokens.splice(0, 0, importComponent);
      } else {
        if (state.tokens[index]) {
          const content = state.tokens[index].content;
          state.tokens[index].content = content.replace(
            "</script>",
            `${importString}
</script>`
          );
        }
      }
    };
    const regex = /<DemoPreviewGroup\s+dir=['"]([^'"]+)['"]\s*\/?>/g;
    state.src.replaceAll(regex, (_match, dir) => {
      const path = state.env?.path;
      const componentDir = join(dirname3(path), dir).replaceAll(
        "\\",
        "/"
      );
      let childFiles = [];
      let dirExists = true;
      try {
        childFiles = readdirSync(componentDir, {
          encoding: "utf8",
          recursive: false,
          withFileTypes: false
        }) || [];
      } catch {
        dirExists = false;
      }
      if (!dirExists) {
        return "";
      }
      const uniqueWord = generateContentHash(componentDir);
      const ComponentName = `DemoComponent_${uniqueWord}`;
      insertComponentImport(
        `import ${ComponentName} from '${componentDir}/index.vue'`
      );
      const { path: _path } = state.env;
      const index = state.tokens.findIndex((i) => i.content.match(regex));
      if (!state.tokens[index]) {
        return "";
      }
      const firstString = "index.vue";
      childFiles = childFiles.sort((a, b) => {
        if (a === firstString) return -1;
        if (b === firstString) return 1;
        return a.localeCompare(b, "en", { sensitivity: "base" });
      });
      state.tokens[index].content = `<DemoPreviewGroup files="${encodeURIComponent(JSON.stringify(childFiles))}" ><${ComponentName}/>`;
      const _dummyToken = new state.Token("", "", 0);
      const tokenArray = [];
      childFiles.forEach((filename) => {
        const templateStart = new state.Token("html_inline", "", 0);
        templateStart.content = `<template #${filename}>`;
        tokenArray.push(templateStart);
        const resolvedPath = join(componentDir, filename);
        const { extension, filepath, lang, lines, title } = rawPathToToken(resolvedPath);
        const token = new state.Token("fence", "code", 0);
        token.info = `${lang || extension}${lines ? `{${lines}}` : ""}${title ? `[${title}]` : ""}`;
        token.content = `<<< ${filepath}`;
        token.src = [resolvedPath];
        tokenArray.push(token);
        const templateEnd = new state.Token("html_inline", "", 0);
        templateEnd.content = "</template>";
        tokenArray.push(templateEnd);
      });
      const endTag = new state.Token("html_inline", "", 0);
      endTag.content = "</DemoPreviewGroup>";
      tokenArray.push(endTag);
      state.tokens.splice(index + 1, 0, ...tokenArray);
      return "";
    });
  });
};
function generateContentHash(input, length = 10) {
  const hash = crypto.createHash("sha256").update(input).digest("hex");
  return Number.parseInt(hash, 16).toString(36).slice(0, length);
}

// .vitepress/config.mts
var config_default = defineConfig({
  title: "@king-one/antdv",
  description: "A VitePress Site",
  head: [
    [
      "link",
      {
        rel: "manifest",
        href: "/manifest.webmanifest"
      }
    ]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
      {
        text: "\u76F8\u5173\u94FE\u63A5",
        items: [
          { text: "@king-one/use", link: "https://www.npmjs.com/package/@king-one/use" },
          { text: "@king-one/utils", link: "https://www.npmjs.com/package/@king-one/utils" }
        ]
      }
    ],
    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" }
        ]
      },
      {
        text: "Basics \u57FA\u7840\u7EC4\u4EF6",
        items: [
          { text: "Modal \u5BF9\u8BDD\u6846", link: "/components/modal" },
          { text: "Scrollbar \u6EDA\u52A8\u6761", link: "/components/scroll-bar" },
          { text: "ProTitle \u6807\u9898", link: "/components/pro-title" },
          { text: "VirtualList \u865A\u62DF\u5217\u8868", link: "/components/virtual-list" }
        ]
      }
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" }
    ],
    search: {
      provider: "local"
    }
  },
  markdown: {
    config: (md) => {
      md.use(containerPreview);
      md.use(componentPreview);
      md.use(demoPreviewGroupPlugin);
    },
    // catppuccin-latte material-theme-lighter one-light
    theme: { light: "github-light", dark: "one-dark-pro" }
  },
  vite: {
    server: {
      port: 9001,
      host: "0.0.0.0"
    },
    plugins: [
      vueJsx(),
      VitePWA({
        includeAssets: ["favicon.svg", "favicon.ico", "robots.txt", "apple-touch-icon.png"],
        manifest: {
          name: "My Awesome Project",
          short_name: "\u98CE\u8D77\u4E8E\u9752\u840D\u4E4B\u672B",
          description: "Answer Explanation All",
          theme_color: "#ffffff",
          icons: [
            {
              src: "/pwa/android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png"
            },
            {
              src: "/pwa/android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png"
            },
            {
              src: "/pwa/android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable"
            }
          ]
        }
      })
    ]
  }
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLnZpdGVwcmVzcy9jb25maWcubXRzIiwgIi4uL3NoYXJlZC1kb2NzL3NyYy9wbHVnaW5zL3V0aWxzLnRzIiwgIi4uL3NoYXJlZC1kb2NzL3NyYy9wbHVnaW5zL2NvbXBvbmVudFByZXZpZXcudHMiLCAiLi4vc2hhcmVkLWRvY3Mvc3JjL3BsdWdpbnMvY29udGFpbmVyUHJldmlldy50cyIsICIuLi9zaGFyZWQtZG9jcy9zcmMvcGx1Z2lucy9pbmRleC50cyIsICIuLi9zaGFyZWQtZG9jcy9zcmMvcGx1Z2lucy9jb21wb2VudEdyb3VwLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2Nhb2hhby93b3JrL3BsdWdpbnMveWFueGluL2tpbmctb25lLXY1L2RvY3MvYW50ZHYtZG9jcy8udml0ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvY2FvaGFvL3dvcmsvcGx1Z2lucy95YW54aW4va2luZy1vbmUtdjUvZG9jcy9hbnRkdi1kb2NzLy52aXRlcHJlc3MvY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvY2FvaGFvL3dvcmsvcGx1Z2lucy95YW54aW4va2luZy1vbmUtdjUvZG9jcy9hbnRkdi1kb2NzLy52aXRlcHJlc3MvY29uZmlnLm10c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGVwcmVzcydcblxuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSdcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcbmltcG9ydCB7IGNvbXBvbmVudFByZXZpZXcsIGNvbnRhaW5lclByZXZpZXcgfSBmcm9tICcuLi8uLi9zaGFyZWQtZG9jcy9zcmMvcGx1Z2lucydcbmltcG9ydCB7IGRlbW9QcmV2aWV3R3JvdXBQbHVnaW4gfSBmcm9tICcuLi8uLi9zaGFyZWQtZG9jcy9zcmMvcGx1Z2lucy9jb21wb2VudEdyb3VwJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICB0aXRsZTogJ0BraW5nLW9uZS9hbnRkdicsXG4gIGRlc2NyaXB0aW9uOiAnQSBWaXRlUHJlc3MgU2l0ZScsXG4gIGhlYWQ6IFtcbiAgICBbXG4gICAgICAnbGluaycsXG4gICAgICB7XG4gICAgICAgIHJlbDogJ21hbmlmZXN0JyxcbiAgICAgICAgaHJlZjogJy9tYW5pZmVzdC53ZWJtYW5pZmVzdCdcbiAgICAgIH1cbiAgICBdXG4gIF0sXG4gIHRoZW1lQ29uZmlnOiB7XG4gICAgLy8gaHR0cHM6Ly92aXRlcHJlc3MuZGV2L3JlZmVyZW5jZS9kZWZhdWx0LXRoZW1lLWNvbmZpZ1xuICAgIG5hdjogW1xuICAgICAgeyB0ZXh0OiAnSG9tZScsIGxpbms6ICcvJyB9LFxuICAgICAgeyB0ZXh0OiAnRXhhbXBsZXMnLCBsaW5rOiAnL21hcmtkb3duLWV4YW1wbGVzJyB9LFxuICAgICAge1xuICAgICAgICB0ZXh0OiAnXHU3NkY4XHU1MTczXHU5NEZFXHU2M0E1JyxcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7IHRleHQ6ICdAa2luZy1vbmUvdXNlJywgbGluazogJ2h0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL0BraW5nLW9uZS91c2UnIH0sXG4gICAgICAgICAgeyB0ZXh0OiAnQGtpbmctb25lL3V0aWxzJywgbGluazogJ2h0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL0BraW5nLW9uZS91dGlscycgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSxcblxuICAgIHNpZGViYXI6IFtcbiAgICAgIHtcbiAgICAgICAgdGV4dDogJ0V4YW1wbGVzJyxcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7IHRleHQ6ICdNYXJrZG93biBFeGFtcGxlcycsIGxpbms6ICcvbWFya2Rvd24tZXhhbXBsZXMnIH0sXG4gICAgICAgICAgeyB0ZXh0OiAnUnVudGltZSBBUEkgRXhhbXBsZXMnLCBsaW5rOiAnL2FwaS1leGFtcGxlcycgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0ZXh0OiAnQmFzaWNzIFx1NTdGQVx1Nzg0MFx1N0VDNFx1NEVGNicsXG4gICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgeyB0ZXh0OiAnTW9kYWwgXHU1QkY5XHU4QkREXHU2ODQ2JywgbGluazogJy9jb21wb25lbnRzL21vZGFsJyB9LFxuICAgICAgICAgIHsgdGV4dDogJ1Njcm9sbGJhciBcdTZFREFcdTUyQThcdTY3NjEnLCBsaW5rOiAnL2NvbXBvbmVudHMvc2Nyb2xsLWJhcicgfSxcbiAgICAgICAgICB7IHRleHQ6ICdQcm9UaXRsZSBcdTY4MDdcdTk4OTgnLCBsaW5rOiAnL2NvbXBvbmVudHMvcHJvLXRpdGxlJyB9LFxuICAgICAgICAgIHsgdGV4dDogJ1ZpcnR1YWxMaXN0IFx1ODY1QVx1NjJERlx1NTIxN1x1ODg2OCcsIGxpbms6ICcvY29tcG9uZW50cy92aXJ0dWFsLWxpc3QnIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF0sXG5cbiAgICBzb2NpYWxMaW5rczogW1xuICAgICAgeyBpY29uOiAnZ2l0aHViJywgbGluazogJ2h0dHBzOi8vZ2l0aHViLmNvbS92dWVqcy92aXRlcHJlc3MnIH1cbiAgICBdLFxuICAgIHNlYXJjaDoge1xuICAgICAgcHJvdmlkZXI6ICdsb2NhbCdcbiAgICB9XG4gIH0sXG4gIG1hcmtkb3duOiB7XG4gICAgY29uZmlnOiAobWQpID0+IHtcbiAgICAgIG1kLnVzZShjb250YWluZXJQcmV2aWV3KVxuICAgICAgbWQudXNlKGNvbXBvbmVudFByZXZpZXcpXG4gICAgICBtZC51c2UoZGVtb1ByZXZpZXdHcm91cFBsdWdpbilcbiAgICB9LFxuICAgIC8vIGNhdHBwdWNjaW4tbGF0dGUgbWF0ZXJpYWwtdGhlbWUtbGlnaHRlciBvbmUtbGlnaHRcbiAgICB0aGVtZTogeyBsaWdodDogJ2dpdGh1Yi1saWdodCcsIGRhcms6ICdvbmUtZGFyay1wcm8nIH1cbiAgfSxcbiAgdml0ZToge1xuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogOTAwMSxcbiAgICAgIGhvc3Q6ICcwLjAuMC4wJ1xuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgdnVlSnN4KCksXG4gICAgICBWaXRlUFdBKHtcbiAgICAgICAgaW5jbHVkZUFzc2V0czogWydmYXZpY29uLnN2ZycsICdmYXZpY29uLmljbycsICdyb2JvdHMudHh0JywgJ2FwcGxlLXRvdWNoLWljb24ucG5nJ10sXG4gICAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgICAgbmFtZTogJ015IEF3ZXNvbWUgUHJvamVjdCcsXG4gICAgICAgICAgc2hvcnRfbmFtZTogJ1x1OThDRVx1OEQ3N1x1NEU4RVx1OTc1Mlx1ODQwRFx1NEU0Qlx1NjcyQicsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdBbnN3ZXIgRXhwbGFuYXRpb24gQWxsJyxcbiAgICAgICAgICB0aGVtZV9jb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICAgIGljb25zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNyYzogJy9wd2EvYW5kcm9pZC1jaHJvbWUtMTkyeDE5Mi5wbmcnLFxuICAgICAgICAgICAgICBzaXplczogJzE5MngxOTInLFxuICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3JjOiAnL3B3YS9hbmRyb2lkLWNocm9tZS01MTJ4NTEyLnBuZycsXG4gICAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXG4gICAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzcmM6ICcvcHdhL2FuZHJvaWQtY2hyb21lLTUxMng1MTIucG5nJyxcbiAgICAgICAgICAgICAgc2l6ZXM6ICc1MTJ4NTEyJyxcbiAgICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgICAgIHB1cnBvc2U6ICdhbnkgbWFza2FibGUnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIF1cbiAgfVxufSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2Nhb2hhby93b3JrL3BsdWdpbnMveWFueGluL2tpbmctb25lLXY1L2RvY3Mvc2hhcmVkLWRvY3Mvc3JjL3BsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9jYW9oYW8vd29yay9wbHVnaW5zL3lhbnhpbi9raW5nLW9uZS12NS9kb2NzL3NoYXJlZC1kb2NzL3NyYy9wbHVnaW5zL3V0aWxzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9jYW9oYW8vd29yay9wbHVnaW5zL3lhbnhpbi9raW5nLW9uZS12NS9kb2NzL3NoYXJlZC1kb2NzL3NyYy9wbHVnaW5zL3V0aWxzLnRzXCI7aW1wb3J0IHR5cGUgTWFya2Rvd25JdCBmcm9tICdtYXJrZG93bi1pdCdcblxuLy8gY29tcG9uZW50UHJldmlldyBjaGVja1xuZXhwb3J0IGNvbnN0IGlzQ2hlY2tQcmV2aWV3Q29tMSA9IC9ePHByZXZpZXcgKC4qKT48XFwvcHJldmlldz4kL1xuZXhwb3J0IGNvbnN0IGlzQ2hlY2tQcmV2aWV3Q29tMiA9IC9ePHByZXZpZXcgKC4qKSBcXC8+JC9cbmV4cG9ydCBjb25zdCBpc0NoZWNrQ29udGFpbmVyUHJldmlldyA9IC9eZGVtby1wcmV2aWV3PSguKykkL1xuXG5jb25zdCBzY3JpcHRSRSA9IC88XFwvc2NyaXB0Pi9cbmNvbnN0IHNjcmlwdExhbmdUc1JFID0gLzxcXHMqc2NyaXB0W14+XSpcXGJsYW5nPVsnXCJddHNbJ1wiXVtePl0qL1xuY29uc3Qgc2NyaXB0U2V0dXBSRSA9IC88XFxzKnNjcmlwdFtePl0qXFxic2V0dXBcXGJbXj5dKi9cbmNvbnN0IHNjcmlwdENsaWVudFJFID0gLzxcXHMqc2NyaXB0W14+XSpcXGJjbGllbnRcXGJbXj5dKi9cbmNvbnN0IHNjcmlwdFNldHVwQ29tbW9uUkUgPSAvPFxccypzY3JpcHRcXHMrKD86KHNldHVwfGxhbmc9J3RzJ3xsYW5nPVwidHNcIilcXHMqKT8oc2V0dXB8bGFuZz0ndHMnfGxhbmc9XCJ0c1wiKT9cXHMqPi9cblxuLyoqXG4gKiBcdTdFREZcdTRFMDBcdTU5MDRcdTc0MDZcdTdFQzRcdTRFRjZcdTU0MERcdTc5RjAtPlx1OUE3Q1x1NUNGMFx1NTQ3RFx1NTQwRFxuICogQHBhcmFtIGNvbXBvbmVudE5hbWVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZUNvbXBvbmVudE5hbWUoY29tcG9uZW50TmFtZTogc3RyaW5nKSB7XG4gIGxldCBuZXdOYW1lID0gY29tcG9uZW50TmFtZVxuICBuZXdOYW1lID0gbmV3TmFtZS5yZXBsYWNlQWxsKC9bX3wtXSsoXFx3KS9nLCAoJDAsICQxKSA9PiB7XG4gICAgcmV0dXJuICQxLnRvVXBwZXJDYXNlKClcbiAgfSlcbiAgcmV0dXJuIG5ld05hbWVcbn1cblxuLyoqXG4gKiBcdTZDRThcdTUxNjUgc2NyaXB0IFx1ODExQVx1NjcyQ1xuICogQHBhcmFtIG1kSW5zdGFuY2VcbiAqIEBwYXJhbSBwYXRoXG4gKiBAcGFyYW0gY29tcG9uZW50TmFtZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0Q29tcG9uZW50SW1wb3J0U2NyaXB0KGVudjogYW55LCBwYXRoOiBzdHJpbmcsIGNvbXBvbmVudE5hbWU6IHN0cmluZykge1xuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdnVlanMvdml0ZXByZXNzL2lzc3Vlcy8xMjU4ICBfX1BhdGhcdTMwMDFfX1JlbGF0aXZlcGF0aFx1MzAwMV9fZGF0YS5Ib2lzdGVkdGFncyBcdTg4QUJcdTUyMjBcdTk2NjRcdTg5RTNcdTUxQjNcdTY1QjlcdTY4NDhcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21kaXQtdnVlL21kaXQtdnVlL2Jsb2IvbWFpbi9wYWNrYWdlcy9wbHVnaW4tc2ZjL3NyYy90eXBlcy50c1xuICAvLyBodHRwczovL2dpdGh1Yi5jb20vbWRpdC12dWUvbWRpdC12dWUvYmxvYi9tYWluL3BhY2thZ2VzL3BsdWdpbi1zZmMvdGVzdHMvX19zbmFwc2hvdHNfXy9zZmMtcGx1Z2luLnNwZWMudHMuc25hcFxuICBjb25zdCBzY3JpcHRzQ29kZSA9IGVudi5zZmNCbG9ja3Muc2NyaXB0cyBhcyBhbnlbXVxuXG4gIC8vIFx1NTIyNFx1NjVBRE1EXHU2NTg3XHU0RUY2XHU1MTg1XHU5MEU4XHU2NjJGXHU1NDI2XHU2NzJDXHU4RUFCXHU1QzMxXHU1QjU4XHU1NzI4IDxzY3JpcHQgc2V0dXA+IFx1ODExQVx1NjcyQ1xuXG4gIGNvbnN0IHNjcmlwdHNTZXR1cEluZGV4ID0gc2NyaXB0c0NvZGUuZmluZEluZGV4KChzY3JpcHQ6IGFueSkgPT4ge1xuICAgIGlmIChzY3JpcHRTZXR1cFJFLnRlc3Qoc2NyaXB0LnRhZ09wZW4pIHx8IHNjcmlwdExhbmdUc1JFLnRlc3Qoc2NyaXB0LnRhZ09wZW4pKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcbiAgfSlcblxuICAvLyBcdTdFREZcdTRFMDBcdTU5MDRcdTc0MDZcdTdFQzRcdTRFRjZcdTU0MERcdTc5RjBcdTRFM0FcdTlBN0NcdTVDRjBcdTU0N0RcdTU0MERcbiAgY29uc3QgX2NvbXBvbmVudE5hbWUgPSBoYW5kbGVDb21wb25lbnROYW1lKGNvbXBvbmVudE5hbWUpXG5cbiAgLy8gTURcdTY1ODdcdTRFRjZcdTRFMkRcdTZDQTFcdTY3MDkgPHNjcmlwdCBzZXR1cD4gXHU2MjE2IDxzY3JpcHQgc2V0dXAgbGFuZz0ndHMnPiBcdTgxMUFcdTY3MkNcdTY1ODdcdTRFRjZcbiAgaWYgKHNjcmlwdHNTZXR1cEluZGV4ID09PSAtMSkge1xuICAgIGNvbnN0IHNjcmlwdEJsb2NrT2JqID0ge1xuICAgICAgdHlwZTogJ3NjcmlwdCcsXG4gICAgICB0YWdDbG9zZTogJzwvc2NyaXB0PicsXG4gICAgICB0YWdPcGVuOiAnPHNjcmlwdCBzZXR1cCBsYW5nPVxcJ3RzXFwnPicsXG4gICAgICBjb250ZW50OiBgPHNjcmlwdCBzZXR1cCBsYW5nPSd0cyc+XG4gICAgICAgIGltcG9ydCAke19jb21wb25lbnROYW1lfSBmcm9tICcke3BhdGh9J1xuICAgICAgICA8L3NjcmlwdD5gLFxuICAgICAgY29udGVudFN0cmlwcGVkOiBgaW1wb3J0ICR7X2NvbXBvbmVudE5hbWV9IGZyb20gJyR7cGF0aH0nYFxuICAgIH1cbiAgICBzY3JpcHRzQ29kZS5wdXNoKHNjcmlwdEJsb2NrT2JqKVxuICB9XG4gIGVsc2Uge1xuICAgIC8vIE1EXHU2NTg3XHU0RUY2XHU2Q0U4XHU1MTY1XHU0RTg2IDxzY3JpcHQgc2V0dXA+IFx1NjIxNiA8c2NyaXB0IHNldHVwIGxhbmc9J3RzJz4gXHU4MTFBXHU2NzJDXG4gICAgY29uc3Qgb2xkU2NyaXB0c1NldHVwID0gc2NyaXB0c0NvZGVbMF1cbiAgICAvLyBNRFx1NjU4N1x1NEVGNlx1NEUyRFx1NUI1OFx1NTcyOFx1NURGMlx1N0VDRlx1NUYxNVx1NTE2NVx1NEU4Nlx1N0VDNFx1NEVGNlxuICAgIGlmIChvbGRTY3JpcHRzU2V0dXAuY29udGVudC5pbmNsdWRlcyhwYXRoKSAmJiBvbGRTY3JpcHRzU2V0dXAuY29udGVudC5pbmNsdWRlcyhfY29tcG9uZW50TmFtZSkpIHtcbiAgICAgIHNjcmlwdHNDb2RlWzBdLmNvbnRlbnQgPSBvbGRTY3JpcHRzU2V0dXAuY29udGVudFxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vIE1EXHU2NTg3XHU0RUY2XHU0RTJEXHU0RTBEXHU1QjU4XHU1NzI4XHU3RUM0XHU0RUY2IFx1NkRGQlx1NTJBMFx1N0VDNFx1NEVGNiBpbXBvcnQgJHtfY29tcG9uZW50TmFtZX0gZnJvbSAnJHtwYXRofSdcXG5cblxuICAgICAgLy8gXHU1OTgyXHU2NzlDTURcdTY1ODdcdTRFRjZcdTRFMkRcdTVCNThcdTU3MjggPHNjcmlwdCBzZXR1cCBsYW5nPVwidHNcIj5cdTMwMDE8c2NyaXB0IGxhbmc9XCJ0c1wiIHNldHVwPiAgXHU2MjE2IDxzY3JpcHQgc2V0dXA+IFx1NEVFM1x1NzgwMVx1NTc1NywgXHU5MEEzXHU0RTQ4XHU3RURGXHU0RTAwXHU4RjZDXHU2MzYyXHU0RTNBIDxzY3JpcHQgc2V0dXAgbGFuZz1cInRzXCI+XG4gICAgICBjb25zdCBzY3JpcHRDb2RlQmxvY2sgPSAnPHNjcmlwdCBsYW5nPVwidHNcIiBzZXR1cD5cXG4nXG4gICAgICBzY3JpcHRzQ29kZVswXS5jb250ZW50ID0gc2NyaXB0c0NvZGVbMF0uY29udGVudC5yZXBsYWNlKHNjcmlwdFNldHVwQ29tbW9uUkUsIHNjcmlwdENvZGVCbG9jaylcblxuICAgICAgLy8gXHU1QzA2XHU3RUM0XHU0RUY2XHU1RjE1XHU1MTY1XHU3Njg0XHU0RUUzXHU3ODAxXHU2NTNFXHU4RkRCXHU1M0JCXG4gICAgICBzY3JpcHRzQ29kZVswXS5jb250ZW50ID0gc2NyaXB0c0NvZGVbMF0uY29udGVudC5yZXBsYWNlKFxuICAgICAgICBzY3JpcHRDb2RlQmxvY2ssXG4gICAgICAgIGA8c2NyaXB0IHNldHVwPlxcblxuICAgICAgaW1wb3J0ICR7X2NvbXBvbmVudE5hbWV9IGZyb20gJyR7cGF0aH0nXFxuYFxuICAgICAgKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFx1NkU5MFx1NzgwMSA9PiBcdTRFRTNcdTc4MDFcdTU3NTdcbiAqIEBwYXJhbSBtZEluc3RhbmNlXG4gKiBAcGFyYW0gc291cmNlQ29kZVxuICogQHBhcmFtIHN1ZmZpeFxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zZm9ybUhpZ2hsaWdodENvZGUobWRJbnN0YW5jZTogTWFya2Rvd25JdCwgc291cmNlQ29kZTogc3RyaW5nLCBzdWZmaXg6IHN0cmluZykge1xuICByZXR1cm4gbWRJbnN0YW5jZS5vcHRpb25zLmhpZ2hsaWdodCEoc291cmNlQ29kZSwgc3VmZml4LCAnJylcbn1cblxuLyoqXG4gKiBcdTY4MzlcdTYzNkVcdTdFQzRcdTRFRjZcdThERUZcdTVGODRcdTdFQzRcdTU0MDhcdTdFQzRcdTRFRjZcdTVGMTVcdTc1MjhcdTU0MERcdTc5RjBcbiAqIEBwYXJhbSBwYXRoXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcG9zZUNvbXBvbmVudE5hbWUocGF0aDogc3RyaW5nKSB7XG4gIGxldCBpc0ZsYWcgPSB0cnVlXG4gIGxldCBjb21wb25lbnRMaXN0OiBzdHJpbmdbXSA9IFtdXG4gIHdoaWxlIChpc0ZsYWcpIHtcbiAgICBjb25zdCBsYXN0SW5kZXggPSBwYXRoLmxhc3RJbmRleE9mKCcvJylcbiAgICBpZiAobGFzdEluZGV4ID09PSAtMSkge1xuICAgICAgaXNGbGFnID0gZmFsc2VcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBjb25zdCBuYW1lID0gcGF0aC5zdWJzdHJpbmcobGFzdEluZGV4ICsgMSlcblxuICAgICAgY29tcG9uZW50TGlzdC51bnNoaWZ0KG5hbWUpXG4gICAgICBwYXRoID0gcGF0aC5zdWJzdHJpbmcoMCwgbGFzdEluZGV4KVxuICAgIH1cbiAgfVxuICBjb21wb25lbnRMaXN0ID0gY29tcG9uZW50TGlzdC5maWx0ZXIoaXRlbSA9PiBpdGVtICE9PSAnJyAmJiBpdGVtICE9PSAnLicgJiYgaXRlbSAhPT0gJy4uJylcbiAgcmV0dXJuIGNvbXBvbmVudExpc3Quam9pbignLScpLnNwbGl0KCcuJylbMF1cbn1cblxuLyoqXG4gKiBcdTY4QzBcdTY3RTVcdTdFQzRcdTRFRjZcdTc2RjhcdTVCRjlcdThERUZcdTVGODRcbiAqIEBwYXJhbSBwYXRoXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gaXNDaGVja2luZ1JlbGF0aXZlUGF0aChwYXRoOiBzdHJpbmcpIHtcbiAgY29uc3QgcmVsYXRpdmVQYXRoID0gcGF0aFxuICBpZiAocmVsYXRpdmVQYXRoLnN0YXJ0c1dpdGgoJy4vJykgfHwgcmVsYXRpdmVQYXRoLnN0YXJ0c1dpdGgoJy4uLycpIHx8IHJlbGF0aXZlUGF0aC5zdGFydHNXaXRoKCcvJykpXG4gICAgcmV0dXJuIHJlbGF0aXZlUGF0aFxuICByZXR1cm4gYC4vJHtyZWxhdGl2ZVBhdGh9YFxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvY2FvaGFvL3dvcmsvcGx1Z2lucy95YW54aW4va2luZy1vbmUtdjUvZG9jcy9zaGFyZWQtZG9jcy9zcmMvcGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2Nhb2hhby93b3JrL3BsdWdpbnMveWFueGluL2tpbmctb25lLXY1L2RvY3Mvc2hhcmVkLWRvY3Mvc3JjL3BsdWdpbnMvY29tcG9uZW50UHJldmlldy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvY2FvaGFvL3dvcmsvcGx1Z2lucy95YW54aW4va2luZy1vbmUtdjUvZG9jcy9zaGFyZWQtZG9jcy9zcmMvcGx1Z2lucy9jb21wb25lbnRQcmV2aWV3LnRzXCI7aW1wb3J0IHsgZGlybmFtZSwgcmVzb2x2ZSB9IGZyb20gJ25vZGU6cGF0aCdcbmltcG9ydCB7IHJlYWRGaWxlU3luYyB9IGZyb20gJ25vZGU6ZnMnXG5pbXBvcnQgdHlwZSBNYXJrZG93bkl0IGZyb20gJ21hcmtkb3duLWl0J1xuaW1wb3J0IHR5cGUgeyBUb2tlbiB9IGZyb20gJ21hcmtkb3duLWl0J1xuaW1wb3J0IHtcbiAgY29tcG9zZUNvbXBvbmVudE5hbWUsXG4gIGluamVjdENvbXBvbmVudEltcG9ydFNjcmlwdCxcbiAgaXNDaGVja2luZ1JlbGF0aXZlUGF0aCxcbiAgdHJhbnNmb3JtSGlnaGxpZ2h0Q29kZVxufSBmcm9tICcuL3V0aWxzJ1xuXG5jb25zdCB0aXRsZVJlZ2V4ID0gL3RpdGxlPVsnXCJdKC4qPylbJ1wiXS9cbmNvbnN0IHBhdGhSZWdleCA9IC9wYXRoPVsnXCJdKC4qPylbJ1wiXS9cbmNvbnN0IGRlc2NyaXB0aW9uUmVnZXggPSAvZGVzY3JpcHRpb249WydcIl0oLio/KVsnXCJdL1xuXG5leHBvcnQgaW50ZXJmYWNlIERlZmF1bHRQcm9wcyB7XG4gIHBhdGg6IHN0cmluZ1xuICB0aXRsZTogc3RyaW5nXG4gIGRlc2NyaXB0aW9uOiBzdHJpbmdcbn1cblxuLyoqXG4gKiBcdTdGMTZcdThCRDFcdTk4ODRcdTg5QzhcdTdFQzRcdTRFRjZcbiAqIEBwYXJhbSBtZFxuICogQHBhcmFtIHRva2VuXG4gKiBAcGFyYW0gZW52XG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNmb3JtUHJldmlldyhtZDogTWFya2Rvd25JdCwgdG9rZW46IFRva2VuLCBlbnY6IGFueSkge1xuICBjb25zdCBjb21wb25lbnRQcm9wczogRGVmYXVsdFByb3BzID0ge1xuICAgIHBhdGg6ICcnLFxuICAgIHRpdGxlOiAnXHU5RUQ4XHU4QkE0XHU2ODA3XHU5ODk4JyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1NjNDRlx1OEZGMFx1NTE4NVx1NUJCOSdcbiAgfVxuXG4gIC8vIFx1ODNCN1x1NTNENlByb3BzXHU3NkY4XHU1MTczXHU1M0MyXHU2NTcwXG4gIGNvbnN0IHRpdGxlVmFsdWUgPSB0b2tlbi5jb250ZW50Lm1hdGNoKHRpdGxlUmVnZXgpXG4gIGNvbnN0IHBhdGhSZWdleFZhbHVlID0gdG9rZW4uY29udGVudC5tYXRjaChwYXRoUmVnZXgpXG4gIGNvbnN0IGRlc2NyaXB0aW9uUmVnZXhWYWx1ZSA9IHRva2VuLmNvbnRlbnQubWF0Y2goZGVzY3JpcHRpb25SZWdleClcblxuICBpZiAoIXBhdGhSZWdleFZhbHVlKVxuICAgIHRocm93IG5ldyBFcnJvcignQHZpdGVwcmVzcy1kZW1vLXByZXZpZXcvcGx1Z2luOiBwYXRoIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJylcblxuICBjb21wb25lbnRQcm9wcy5wYXRoID0gaXNDaGVja2luZ1JlbGF0aXZlUGF0aChwYXRoUmVnZXhWYWx1ZVsxXSlcbiAgY29tcG9uZW50UHJvcHMudGl0bGUgPSB0aXRsZVZhbHVlID8gdGl0bGVWYWx1ZVsxXSA6ICcnXG4gIGNvbXBvbmVudFByb3BzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb25SZWdleFZhbHVlID8gZGVzY3JpcHRpb25SZWdleFZhbHVlWzFdIDogJydcblxuICAvLyBcdTdFQzRcdTRFRjZcdTdFRERcdTVCRjlcdThERUZcdTVGODRcbiAgY29uc3QgY29tcG9uZW50UGF0aCA9IHJlc29sdmUoZGlybmFtZShlbnYucGF0aCksIGNvbXBvbmVudFByb3BzLnBhdGggfHwgJy4nKVxuXG4gIC8vIFx1N0VDNFx1NEVGNlx1NTQwRFxuICBjb25zdCBjb21wb25lbnROYW1lID0gY29tcG9zZUNvbXBvbmVudE5hbWUoY29tcG9uZW50UHJvcHMucGF0aClcbiAgLy8gXHU1NDBFXHU3RjAwXHU1NDBEXG4gIGNvbnN0IHN1ZmZpeE5hbWUgPSBjb21wb25lbnRQYXRoLnN1YnN0cmluZyhjb21wb25lbnRQYXRoLmxhc3RJbmRleE9mKCcuJykgKyAxKVxuXG4gIC8vIFx1NkNFOFx1NTE2NVx1N0VDNFx1NEVGNlx1NUJGQ1x1NTE2NVx1OEJFRFx1NTNFNVxuICBpbmplY3RDb21wb25lbnRJbXBvcnRTY3JpcHQoZW52LCBjb21wb25lbnRQcm9wcy5wYXRoLCBjb21wb25lbnROYW1lKVxuXG4gIC8vIFx1N0VDNFx1NEVGNlx1NkU5MFx1NzgwMVxuICBjb25zdCBjb21wb25lbnRTb3VyY2VDb2RlID0gcmVhZEZpbGVTeW5jKGNvbXBvbmVudFBhdGgsIHtcbiAgICBlbmNvZGluZzogJ3V0Zi04J1xuICB9KVxuICAvLyBcdTZFOTBcdTc4MDFcdTRFRTNcdTc4MDFcdTU3NTdcdUZGMDhcdTdFQ0ZcdThGQzdcdTU5MDRcdTc0MDZcdUZGMDlcbiAgY29uc3QgY29tcGlsZUhpZ2hsaWdodENvZGUgPSB0cmFuc2Zvcm1IaWdobGlnaHRDb2RlKG1kLCBjb21wb25lbnRTb3VyY2VDb2RlLCBzdWZmaXhOYW1lKVxuXG4gIGNvbnN0IGNvZGUgPSBlbmNvZGVVUkkoY29tcG9uZW50U291cmNlQ29kZSlcbiAgY29uc3Qgc2hvd0NvZGUgPSBlbmNvZGVVUklDb21wb25lbnQoY29tcGlsZUhpZ2hsaWdodENvZGUpXG5cbiAgY29uc3Qgc291cmNlQ29kZSA9IGA8ZGVtby1wcmV2aWV3IHRpdGxlPVwiJHtjb21wb25lbnRQcm9wcy50aXRsZX1cIiBkZXNjcmlwdGlvbj1cIiR7Y29tcG9uZW50UHJvcHMuZGVzY3JpcHRpb259XCIgY29kZT1cIiR7Y29kZX1cIiBzaG93Q29kZT1cIiR7c2hvd0NvZGV9XCIgc3VmZml4TmFtZT1cIiR7c3VmZml4TmFtZX1cIiBhYnNvbHV0ZVBhdGg9XCIke2NvbXBvbmVudFBhdGh9XCIgcmVsYXRpdmVQYXRoPVwiJHtjb21wb25lbnRQcm9wcy5wYXRofVwiPlxuICAgIDwke2NvbXBvbmVudE5hbWV9PjwvJHtjb21wb25lbnROYW1lfT5cbiAgPC9kZW1vLXByZXZpZXc+YFxuXG4gIHJldHVybiBzb3VyY2VDb2RlXG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9jYW9oYW8vd29yay9wbHVnaW5zL3lhbnhpbi9raW5nLW9uZS12NS9kb2NzL3NoYXJlZC1kb2NzL3NyYy9wbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvY2FvaGFvL3dvcmsvcGx1Z2lucy95YW54aW4va2luZy1vbmUtdjUvZG9jcy9zaGFyZWQtZG9jcy9zcmMvcGx1Z2lucy9jb250YWluZXJQcmV2aWV3LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9jYW9oYW8vd29yay9wbHVnaW5zL3lhbnhpbi9raW5nLW9uZS12NS9kb2NzL3NoYXJlZC1kb2NzL3NyYy9wbHVnaW5zL2NvbnRhaW5lclByZXZpZXcudHNcIjtpbXBvcnQgeyBkaXJuYW1lLCByZXNvbHZlIH0gZnJvbSAnbm9kZTpwYXRoJ1xuaW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSAnbm9kZTpmcydcbmltcG9ydCB0eXBlIE1hcmtkb3duSXQgZnJvbSAnbWFya2Rvd24taXQnXG5pbXBvcnQgdHlwZSB7IFJlbmRlcmVyLCBUb2tlbiB9IGZyb20gJ21hcmtkb3duLWl0J1xuaW1wb3J0IG1hcmtkb3duSXRDb250YWluZXIgZnJvbSAnbWFya2Rvd24taXQtY29udGFpbmVyJ1xuaW1wb3J0IHtcbiAgY29tcG9zZUNvbXBvbmVudE5hbWUsXG4gIGluamVjdENvbXBvbmVudEltcG9ydFNjcmlwdCxcbiAgaXNDaGVja0NvbnRhaW5lclByZXZpZXcsXG4gIGlzQ2hlY2tpbmdSZWxhdGl2ZVBhdGgsXG4gIHRyYW5zZm9ybUhpZ2hsaWdodENvZGVcbn0gZnJvbSAnLi91dGlscydcblxuY29uc3QgdmFsaWRhdGVDb250YWluZXJSRSA9IC9ecHJldmlldy4qJC9cbmNvbnN0IHBhcnNlQ29udGFpbmVyUGFyYW1SRSA9IC9ecHJldmlld1xccz8oLio/KSg/Olxcc1xcfFxcfFxccyguKikpPyQvXG5cbi8qKlxuICogXHU4MUVBXHU1QjlBXHU0RTQ5XHU1QkI5XHU1NjY4XHU3Njg0XHU2Q0U4XHU1MThDXG4gKiBAcGFyYW0gbWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnRhaW5lckRpcmVjdGl2ZU1vdW50KG1kOiBNYXJrZG93bkl0KSB7XG4gIG1kLnVzZShtYXJrZG93bkl0Q29udGFpbmVyLCAncHJldmlldycsIHtcbiAgICBtYXJrZXI6ICc6JyxcbiAgICB2YWxpZGF0ZTogKHBhcmFtczogYW55KSA9PiB7XG4gICAgICBjb25zdCB2YWxpZGF0ZUNvbnRhaW5lciA9IHBhcmFtcy50cmltKCkubWF0Y2godmFsaWRhdGVDb250YWluZXJSRSlcbiAgICAgIGlmICh2YWxpZGF0ZUNvbnRhaW5lciAmJiB2YWxpZGF0ZUNvbnRhaW5lci5sZW5ndGggIT09IDApXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogXHU4OUUzXHU2NzkwXHU4MUVBXHU1QjlBXHU0RTQ5XHU2NUU1XHU2NzFGXHU3Njg0VGFnXG4gKiBAcGFyYW0gbWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQ29udGFpbmVyVGFnKG1kOiBNYXJrZG93bkl0KSB7XG4gIC8vIFx1NUYwMFx1NTlDQlx1NjgwN1x1N0I3RSA6OjpwcmV2aWV3XG4gIGNvbnN0IGRlZmF1bHRDb250YWluZXJQcmV2aWV3T3BlblJlbmRlciA9IG1kLnJlbmRlcmVyLnJ1bGVzLmNvbnRhaW5lcl9wcmV2aWV3X29wZW4hXG4gIG1kLnJlbmRlcmVyLnJ1bGVzLmNvbnRhaW5lcl9wcmV2aWV3X29wZW4gPSAoXG4gICAgdG9rZW5zOiBUb2tlbltdLFxuICAgIGlkeDogbnVtYmVyLFxuICAgIG9wdGlvbnM6IE1hcmtkb3duSXQuT3B0aW9ucyxcbiAgICBlbnY6IGFueSxcbiAgICBzZWxmOiBSZW5kZXJlclxuICApID0+IHtcbiAgICBjb25zdCB0b2tlbiA9IHRva2Vuc1tpZHhdXG4gICAgLy8gXHU3RUM0XHU0RUY2XHU3Njg0XHU3NkY4XHU1QkY5XHU4REVGXHU1Rjg0XG4gICAgY29uc3QgY29tcG9uZW50UmVsYXRpdmVQYXRoID0gaXNDaGVja2luZ1JlbGF0aXZlUGF0aCh0b2tlbnNbaWR4ICsgMl0uY29udGVudC5zcGxpdCgnPScpWzFdKVxuXG4gICAgLy8gXHU3RUM0XHU0RUY2XHU3RUREXHU1QkY5XHU4REVGXHU1Rjg0XG4gICAgY29uc3QgY29tcG9uZW50UGF0aCA9IHJlc29sdmUoZGlybmFtZShlbnYucGF0aCksIGNvbXBvbmVudFJlbGF0aXZlUGF0aCB8fCAnLicpXG5cbiAgICAvLyBcdTU0MEVcdTdGMDBcdTU0MERcbiAgICBjb25zdCBzdWZmaXhOYW1lID0gY29tcG9uZW50UGF0aC5zdWJzdHJpbmcoY29tcG9uZW50UGF0aC5sYXN0SW5kZXhPZignLicpICsgMSlcbiAgICAvLyBcdTdFQzRcdTRFRjZcdTZFOTBcdTc4MDFcbiAgICBjb25zdCBjb21wb25lbnRTb3VyY2VDb2RlID0gcmVhZEZpbGVTeW5jKGNvbXBvbmVudFBhdGgsIHtcbiAgICAgIGVuY29kaW5nOiAndXRmLTgnXG4gICAgfSlcbiAgICAvLyBcdTZFOTBcdTc4MDFcdTRFRTNcdTc4MDFcdTU3NTdcdUZGMDhcdTdFQ0ZcdThGQzdcdTU5MDRcdTc0MDZcdUZGMDlcbiAgICBjb25zdCBjb21waWxlSGlnaGxpZ2h0Q29kZSA9IHRyYW5zZm9ybUhpZ2hsaWdodENvZGUobWQsIGNvbXBvbmVudFNvdXJjZUNvZGUsIHN1ZmZpeE5hbWUpXG5cbiAgICBjb25zdCBjb2RlID0gZW5jb2RlVVJJKGNvbXBvbmVudFNvdXJjZUNvZGUpXG4gICAgY29uc3Qgc2hvd0NvZGUgPSBlbmNvZGVVUklDb21wb25lbnQoY29tcGlsZUhpZ2hsaWdodENvZGUpXG5cbiAgICBjb25zdCBnZXRQYXJhbUFyciA9IHRva2Vuc1tpZHhdLmluZm8udHJpbSgpLm1hdGNoKHBhcnNlQ29udGFpbmVyUGFyYW1SRSlcbiAgICBjb25zdCB0aXRsZSA9IGdldFBhcmFtQXJyICYmIGdldFBhcmFtQXJyWzFdID8gZ2V0UGFyYW1BcnJbMV0gOiAnJ1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gZ2V0UGFyYW1BcnIgJiYgZ2V0UGFyYW1BcnJbMl0gPyBnZXRQYXJhbUFyclsyXSA6ICcnXG4gICAgaWYgKHRva2VuLm5lc3RpbmcgPT09IDEpXG4gICAgICByZXR1cm4gYDxkZW1vLXByZXZpZXcgdGl0bGU9JyR7dGl0bGV9JyBkZXNjcmlwdGlvbj0nJHtkZXNjcmlwdGlvbn0nIGNvZGU9XCIke2NvZGV9XCIgc2hvd0NvZGU9XCIke3Nob3dDb2RlfVwiIHN1ZmZpeE5hbWU9XCIke3N1ZmZpeE5hbWV9XCIgYWJzb2x1dGVQYXRoPVwiJHtjb21wb25lbnRQYXRofVwiIHJlbGF0aXZlUGF0aD1cIiR7Y29tcG9uZW50UmVsYXRpdmVQYXRofVwiPlxcbjx0ZW1wbGF0ZSAjY29kZT4ke21kLnJlbmRlcignYGBgdnVlIFxcbicrY29tcG9uZW50U291cmNlQ29kZSsnYGBgJyl9PC90ZW1wbGF0ZT5gXG4gICAgcmV0dXJuIGRlZmF1bHRDb250YWluZXJQcmV2aWV3T3BlblJlbmRlcih0b2tlbnMsIGlkeCwgb3B0aW9ucywgZW52LCBzZWxmKVxuICB9XG4gIC8vIFx1OTVFRFx1NTQwOFx1NjgwN1x1N0I3RSA6OjpcbiAgY29uc3QgZGVmYXVsdENvbnRhaW5lclByZXZpZXdDbG9zZVJlbmRlciA9IG1kLnJlbmRlcmVyLnJ1bGVzLmNvbnRhaW5lcl9wcmV2aWV3X2Nsb3NlIVxuICBtZC5yZW5kZXJlci5ydWxlcy5jb250YWluZXJfcHJldmlld19jbG9zZSA9IChcbiAgICB0b2tlbnM6IFRva2VuW10sXG4gICAgaWR4OiBudW1iZXIsXG4gICAgb3B0aW9uczogTWFya2Rvd25JdC5PcHRpb25zLFxuICAgIGVudjogYW55LFxuICAgIHNlbGY6IFJlbmRlcmVyXG4gICkgPT4ge1xuICAgIGNvbnN0IHRva2VuID0gdG9rZW5zW2lkeF1cblxuICAgIGlmICh0b2tlbi5uZXN0aW5nID09PSAtMSlcbiAgICAgIHJldHVybiBgPC9kZW1vLXByZXZpZXc+XFxuYFxuICAgIHJldHVybiBkZWZhdWx0Q29udGFpbmVyUHJldmlld0Nsb3NlUmVuZGVyKHRva2VucywgaWR4LCBvcHRpb25zLCBlbnYsIHNlbGYpXG4gIH1cbn1cblxuLyoqXG4gKiBcdTg5RTNcdTY3OTBcdTgxRUFcdTVCOUFcdTRFNDlcdTVCQjlcdTU2NjhcbiAqIEBwYXJhbSBtZFxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDb250YWluZXIobWQ6IE1hcmtkb3duSXQpIHtcbiAgY29uc3QgZGVmYXVsdEh0bWxUZXh0UmVuZGVyID0gbWQucmVuZGVyZXIucnVsZXMudGV4dCFcbiAgbWQucmVuZGVyZXIucnVsZXMudGV4dCA9ICh0b2tlbnM6IFRva2VuW10sIGlkeDogbnVtYmVyLCBvcHRpb25zOiBNYXJrZG93bkl0Lk9wdGlvbnMsIGVudjogYW55LCBzZWxmOiBSZW5kZXJlcikgPT4ge1xuICAgIGNvbnN0IHRva2VuID0gdG9rZW5zW2lkeF1cbiAgICBpZiAodG9rZW4udHlwZSA9PT0gJ3RleHQnICYmIHRva2VuLmNvbnRlbnQubWF0Y2goaXNDaGVja0NvbnRhaW5lclByZXZpZXcpKSB7XG4gICAgICBjb25zdCBjb21wb25lbnRSZWxhdGl2ZVBhdGggPSBpc0NoZWNraW5nUmVsYXRpdmVQYXRoKHRva2VuLmNvbnRlbnQubWF0Y2goaXNDaGVja0NvbnRhaW5lclByZXZpZXcpIVsxXSlcbiAgICAgIGNvbnN0IGNvbXBvbmVudE5hbWUgPSBjb21wb3NlQ29tcG9uZW50TmFtZShjb21wb25lbnRSZWxhdGl2ZVBhdGgpXG4gICAgICBpbmplY3RDb21wb25lbnRJbXBvcnRTY3JpcHQoZW52LCBjb21wb25lbnRSZWxhdGl2ZVBhdGgsIGNvbXBvbmVudE5hbWUpXG4gICAgICByZXR1cm4gYDwke2NvbXBvbmVudE5hbWV9PjwvJHtjb21wb25lbnROYW1lfT5gXG4gICAgfVxuICAgIHJldHVybiBkZWZhdWx0SHRtbFRleHRSZW5kZXIodG9rZW5zLCBpZHgsIG9wdGlvbnMsIGVudiwgc2VsZilcbiAgfVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvY2FvaGFvL3dvcmsvcGx1Z2lucy95YW54aW4va2luZy1vbmUtdjUvZG9jcy9zaGFyZWQtZG9jcy9zcmMvcGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2Nhb2hhby93b3JrL3BsdWdpbnMveWFueGluL2tpbmctb25lLXY1L2RvY3Mvc2hhcmVkLWRvY3Mvc3JjL3BsdWdpbnMvaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2Nhb2hhby93b3JrL3BsdWdpbnMveWFueGluL2tpbmctb25lLXY1L2RvY3Mvc2hhcmVkLWRvY3Mvc3JjL3BsdWdpbnMvaW5kZXgudHNcIjtpbXBvcnQgdHlwZSBNYXJrZG93bkl0IGZyb20gJ21hcmtkb3duLWl0J1xuaW1wb3J0IHR5cGUgeyBSZW5kZXJlciwgVG9rZW4gfSBmcm9tICdtYXJrZG93bi1pdCdcbmltcG9ydCB7IGlzQ2hlY2tQcmV2aWV3Q29tMSwgaXNDaGVja1ByZXZpZXdDb20yIH0gZnJvbSAnLi91dGlscydcbmltcG9ydCB7IHRyYW5zZm9ybVByZXZpZXcgfSBmcm9tICcuL2NvbXBvbmVudFByZXZpZXcnXG5pbXBvcnQgeyBjb250YWluZXJEaXJlY3RpdmVNb3VudCwgcGFyc2VDb250YWluZXIsIHBhcnNlQ29udGFpbmVyVGFnIH0gZnJvbSAnLi9jb250YWluZXJQcmV2aWV3J1xuLy8gaW1wb3J0IHsgZGVtb1ByZXZpZXdHcm91cFBsdWdpbiAgfSBmcm9tIFwiLi9jb21wb2VudEdyb3VwXCI7XG5leHBvcnQgZnVuY3Rpb24gY29tcG9uZW50UHJldmlldyhtZDphbnkpIHtcbiAgY29uc3QgZGVmYXVsdEh0bWxJbmxpbmVSZW5kZXIgPSBtZC5yZW5kZXJlci5ydWxlcy5odG1sX2lubGluZSFcbiAgbWQucmVuZGVyZXIucnVsZXMuaHRtbF9pbmxpbmUgPSAoXG4gICAgdG9rZW5zOiBUb2tlbltdLFxuICAgIGlkeDogbnVtYmVyLFxuICAgIG9wdGlvbnM6IE1hcmtkb3duSXQuT3B0aW9ucyxcbiAgICBlbnY6IGFueSxcbiAgICBzZWxmOiBSZW5kZXJlclxuICApID0+IHtcbiAgICBjb25zdCB0b2tlbiA9IHRva2Vuc1tpZHhdXG4gICAgaWYgKGlzQ2hlY2tQcmV2aWV3Q29tMS50ZXN0KHRva2VuLmNvbnRlbnQpIHx8IGlzQ2hlY2tQcmV2aWV3Q29tMi50ZXN0KHRva2VuLmNvbnRlbnQpKSB7XG4gICAgICByZXR1cm4gdHJhbnNmb3JtUHJldmlldyhtZCwgdG9rZW4sIGVudilcbiAgICB9XG4gICAgcmV0dXJuIGRlZmF1bHRIdG1sSW5saW5lUmVuZGVyKHRva2VucywgaWR4LCBvcHRpb25zLCBlbnYsIHNlbGYpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnRhaW5lclByZXZpZXcobWQ6IGFueSkge1xuICAvLyBkZW1vUHJldmlld0dyb3VwUGx1Z2luKG1kKVxuICBjb250YWluZXJEaXJlY3RpdmVNb3VudChtZClcbiAgcGFyc2VDb250YWluZXJUYWcobWQpXG4gIHBhcnNlQ29udGFpbmVyKG1kKVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvY2FvaGFvL3dvcmsvcGx1Z2lucy95YW54aW4va2luZy1vbmUtdjUvZG9jcy9zaGFyZWQtZG9jcy9zcmMvcGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2Nhb2hhby93b3JrL3BsdWdpbnMveWFueGluL2tpbmctb25lLXY1L2RvY3Mvc2hhcmVkLWRvY3Mvc3JjL3BsdWdpbnMvY29tcG9lbnRHcm91cC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvY2FvaGFvL3dvcmsvcGx1Z2lucy95YW54aW4va2luZy1vbmUtdjUvZG9jcy9zaGFyZWQtZG9jcy9zcmMvcGx1Z2lucy9jb21wb2VudEdyb3VwLnRzXCI7aW1wb3J0IHR5cGUgeyBNYXJrZG93bkVudiwgTWFya2Rvd25SZW5kZXJlciB9IGZyb20gJ3ZpdGVwcmVzcyc7XG5cbmltcG9ydCBjcnlwdG8gZnJvbSAnbm9kZTpjcnlwdG8nO1xuaW1wb3J0IHsgcmVhZGRpclN5bmMgfSBmcm9tICdub2RlOmZzJztcbmltcG9ydCB7IGpvaW4sIGRpcm5hbWUgfSBmcm9tICdub2RlOnBhdGgnO1xuXG5leHBvcnQgY29uc3QgcmF3UGF0aFJlZ2V4cCA9XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWdleHAvbm8tc3VwZXItbGluZWFyLWJhY2t0cmFja2luZywgcmVnZXhwL3N0cmljdFxuICAvXiguKz8oPzpcXC4oW1xcZGEtel0rKSk/KSgjW1xcdy1dKyk/KD86ID97KFxcZCsoPzpbLC1dXFxkKykqKT8gPyhcXFMrKT99KT8gPyg/OlxcWyguKyldKT8kLztcblxuZnVuY3Rpb24gcmF3UGF0aFRvVG9rZW4ocmF3UGF0aDogc3RyaW5nKSB7XG4gIGNvbnN0IFtcbiAgICBmaWxlcGF0aCA9ICcnLFxuICAgIGV4dGVuc2lvbiA9ICcnLFxuICAgIHJlZ2lvbiA9ICcnLFxuICAgIGxpbmVzID0gJycsXG4gICAgbGFuZyA9ICcnLFxuICAgIHJhd1RpdGxlID0gJycsXG4gIF0gPSAocmF3UGF0aFJlZ2V4cC5leGVjKHJhd1BhdGgpIHx8IFtdKS5zbGljZSgxKTtcblxuICBjb25zdCB0aXRsZSA9IHJhd1RpdGxlIHx8IGZpbGVwYXRoLnNwbGl0KCcvJykucG9wKCkgfHwgJyc7XG5cbiAgcmV0dXJuIHsgZXh0ZW5zaW9uLCBmaWxlcGF0aCwgbGFuZywgbGluZXMsIHJlZ2lvbiwgdGl0bGUgfTtcbn1cblxuZXhwb3J0IGNvbnN0IGRlbW9QcmV2aWV3R3JvdXBQbHVnaW4gPSAobWQ6IE1hcmtkb3duUmVuZGVyZXIpID0+IHtcbiAgbWQuY29yZS5ydWxlci5hZnRlcignaW5saW5lJywgJ2RlbW8tcHJldmlldycsIChzdGF0ZSkgPT4ge1xuICAgIGNvbnN0IGluc2VydENvbXBvbmVudEltcG9ydCA9IChpbXBvcnRTdHJpbmc6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgaW5kZXggPSBzdGF0ZS50b2tlbnMuZmluZEluZGV4KFxuICAgICAgICAoaSkgPT4gaS50eXBlID09PSAnaHRtbF9ibG9jaycgJiYgaS5jb250ZW50Lm1hdGNoKC88c2NyaXB0IHNldHVwPi9nKSxcbiAgICAgICk7XG4gICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgIGNvbnN0IGltcG9ydENvbXBvbmVudCA9IG5ldyBzdGF0ZS5Ub2tlbignaHRtbF9ibG9jaycsICcnLCAwKTtcbiAgICAgICAgaW1wb3J0Q29tcG9uZW50LmNvbnRlbnQgPSBgPHNjcmlwdCBzZXR1cD5cXG4ke2ltcG9ydFN0cmluZ31cXG48L3NjcmlwdD5cXG5gO1xuICAgICAgICBzdGF0ZS50b2tlbnMuc3BsaWNlKDAsIDAsIGltcG9ydENvbXBvbmVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc3RhdGUudG9rZW5zW2luZGV4XSkge1xuICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBzdGF0ZS50b2tlbnNbaW5kZXhdLmNvbnRlbnQ7XG4gICAgICAgICAgc3RhdGUudG9rZW5zW2luZGV4XS5jb250ZW50ID0gY29udGVudC5yZXBsYWNlKFxuICAgICAgICAgICAgJzwvc2NyaXB0PicsXG4gICAgICAgICAgICBgJHtpbXBvcnRTdHJpbmd9XFxuPC9zY3JpcHQ+YCxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICAvLyBEZWZpbmUgdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBtYXRjaCB0aGUgZGVzaXJlZCBwYXR0ZXJuXG4gICAgY29uc3QgcmVnZXggPSAvPERlbW9QcmV2aWV3R3JvdXBcXHMrZGlyPVsnXCJdKFteJ1wiXSspWydcIl1cXHMqXFwvPz4vZztcbiAgICAvLyBjb25zdCByZWdleCA9IC88RGVtb1ByZXZpZXdHcm91cFtePl0qXFxzZGlyPScoW15cIl0qKScvZztcbiAgICAvLyBJdGVyYXRlIHRocm91Z2ggdGhlIE1hcmtkb3duIGNvbnRlbnQgYW5kIHJlcGxhY2UgdGhlIHBhdHRlcm5cbiAgICBzdGF0ZS5zcmMucmVwbGFjZUFsbChyZWdleCwgKF9tYXRjaCwgZGlyKSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhkaXIpXG4gICAgICAvLyAgY29uc29sZS5sb2coc3RhdGUuZW52KVxuICAgICAgY29uc3QgcGF0aCA9IHN0YXRlLmVudj8ucGF0aFxuXG4gICAgICBjb25zdCBjb21wb25lbnREaXIgPSBqb2luKGRpcm5hbWUocGF0aCksIGRpcikucmVwbGFjZUFsbChcbiAgICAgICAgJ1xcXFwnLFxuICAgICAgICAnLycsXG4gICAgICApO1xuXG4gICAgICBsZXQgY2hpbGRGaWxlczogc3RyaW5nW10gPSBbXTtcbiAgICAgIGxldCBkaXJFeGlzdHMgPSB0cnVlO1xuXG4gICAgICB0cnkge1xuICAgICAgICBjaGlsZEZpbGVzID1cbiAgICAgICAgICByZWFkZGlyU3luYyhjb21wb25lbnREaXIsIHtcbiAgICAgICAgICAgIGVuY29kaW5nOiAndXRmOCcsXG4gICAgICAgICAgICByZWN1cnNpdmU6IGZhbHNlLFxuICAgICAgICAgICAgd2l0aEZpbGVUeXBlczogZmFsc2UsXG4gICAgICAgICAgfSkgfHwgW107XG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgZGlyRXhpc3RzID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoIWRpckV4aXN0cykge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG4gICAgICBjb25zdCB1bmlxdWVXb3JkID0gZ2VuZXJhdGVDb250ZW50SGFzaChjb21wb25lbnREaXIpO1xuXG4gICAgICBjb25zdCBDb21wb25lbnROYW1lID0gYERlbW9Db21wb25lbnRfJHt1bmlxdWVXb3JkfWA7XG4gICAgICBpbnNlcnRDb21wb25lbnRJbXBvcnQoXG4gICAgICAgIGBpbXBvcnQgJHtDb21wb25lbnROYW1lfSBmcm9tICcke2NvbXBvbmVudERpcn0vaW5kZXgudnVlJ2AsXG4gICAgICApO1xuICAgICAgY29uc3QgeyBwYXRoOiBfcGF0aCB9ID0gc3RhdGUuZW52IGFzIE1hcmtkb3duRW52O1xuXG4gICAgICAvLyBcdTY3RTVcdTYyN0VcdTUzMzlcdTkxNERcdTc2ODQgPERlbW9QcmV2aWV3PiBcdTY4MDdcdTdCN0VcdTU3MjhcdTRFRTRcdTcyNENcdTUyMTdcdTg4NjhcdTRFMkRcdTc2ODRcdTRGNERcdTdGNkVcbiAgICAgIGNvbnN0IGluZGV4ID0gc3RhdGUudG9rZW5zLmZpbmRJbmRleCgoaSkgPT4gaS5jb250ZW50Lm1hdGNoKHJlZ2V4KSk7XG4gICAgICAvLyBcdTU5ODJcdTY3OUNcdTZDQTFcdTY3MDlcdTYyN0VcdTUyMzBcdTUzMzlcdTkxNERcdTc2ODRcdTY4MDdcdTdCN0VcdUZGMENcdThGRDRcdTU2REVcdTdBN0FcdTVCNTdcdTdCMjZcdTRFMzJcbiAgICAgIGlmICghc3RhdGUudG9rZW5zW2luZGV4XSkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG5cbiAgICAgIC8vIFx1NUMwNlx1NjU4N1x1NEVGNlx1NTIxN1x1ODg2OFx1NjMwOVx1NzI3OVx1NUI5QVx1OTg3QVx1NUU4Rlx1NjM5Mlx1NUU4Rlx1RkYwQ1x1Nzg2RVx1NEZERCAnaW5kZXgudnVlJyBcdTRGNERcdTRFOEVcdTY3MDBcdTUyNERcdTk3NjJcbiAgICAgIGNvbnN0IGZpcnN0U3RyaW5nID0gJ2luZGV4LnZ1ZSc7XG4gICAgICBjaGlsZEZpbGVzID0gY2hpbGRGaWxlcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGlmIChhID09PSBmaXJzdFN0cmluZykgcmV0dXJuIC0xO1xuICAgICAgICBpZiAoYiA9PT0gZmlyc3RTdHJpbmcpIHJldHVybiAxO1xuICAgICAgICByZXR1cm4gYS5sb2NhbGVDb21wYXJlKGIsICdlbicsIHsgc2Vuc2l0aXZpdHk6ICdiYXNlJyB9KTtcbiAgICAgIH0pO1xuICAgICAgLy8gXHU2NkY0XHU2NUIwIDxEZW1vUHJldmlldz4gXHU2ODA3XHU3QjdFXHU3Njg0XHU1MTg1XHU1QkI5XHVGRjBDXHU1MzA1XHU1NDJCXHU2NTg3XHU0RUY2XHU1MjE3XHU4ODY4XHU1NDhDXHU3RUM0XHU0RUY2XHU1NDBEXHU3OUYwXG4gICAgICBzdGF0ZS50b2tlbnNbaW5kZXhdLmNvbnRlbnQgPSBgPERlbW9QcmV2aWV3R3JvdXAgZmlsZXM9XCIke2VuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjaGlsZEZpbGVzKSl9XCIgPjwke0NvbXBvbmVudE5hbWV9Lz5gO1xuXG4gICAgICAvLyBcdTUyMUJcdTVFRkFcdTRFMDBcdTRFMkFcdTg2NUFcdTYyREZcdTRFRTRcdTcyNENcdUZGMENcdTc1MjhcdTRFOEVcdTVCNThcdTUwQThcdTc1MUZcdTYyMTBcdTc2ODRcdTZBMjFcdTY3N0ZcdTU0OENcdTRFRTNcdTc4MDFcdTU3NTdcbiAgICAgIGNvbnN0IF9kdW1teVRva2VuID0gbmV3IHN0YXRlLlRva2VuKCcnLCAnJywgMCk7XG4gICAgICBjb25zdCB0b2tlbkFycmF5OiBBcnJheTx0eXBlb2YgX2R1bW15VG9rZW4+ID0gW107XG4gICAgICAvLyBcdTkwNERcdTUzODZcdTY1ODdcdTRFRjZcdTUyMTdcdTg4NjhcdUZGMENcdTc1MUZcdTYyMTBcdTVCRjlcdTVFOTRcdTc2ODRcdTZBMjFcdTY3N0ZcdTU0OENcdTRFRTNcdTc4MDFcdTU3NTdcbiAgICAgIGNoaWxkRmlsZXMuZm9yRWFjaCgoZmlsZW5hbWUpID0+IHtcbiAgICAgICAgLy8gXHU1MjFCXHU1RUZBIDx0ZW1wbGF0ZT4gXHU1RjAwXHU1OUNCXHU2ODA3XHU3QjdFXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlU3RhcnQgPSBuZXcgc3RhdGUuVG9rZW4oJ2h0bWxfaW5saW5lJywgJycsIDApO1xuICAgICAgICB0ZW1wbGF0ZVN0YXJ0LmNvbnRlbnQgPSBgPHRlbXBsYXRlICMke2ZpbGVuYW1lfT5gO1xuICAgICAgICB0b2tlbkFycmF5LnB1c2godGVtcGxhdGVTdGFydCk7XG5cbiAgICAgICAgLy8gXHU2Nzg0XHU1RUZBXHU2NTg3XHU0RUY2XHU3Njg0XHU1QjhDXHU2NTc0XHU4REVGXHU1Rjg0XG4gICAgICAgIGNvbnN0IHJlc29sdmVkUGF0aCA9IGpvaW4oY29tcG9uZW50RGlyLCBmaWxlbmFtZSk7XG5cbiAgICAgICAgLy8gXHU4OUUzXHU2NzkwXHU2NTg3XHU0RUY2XHU4REVGXHU1Rjg0XHVGRjBDXHU4M0I3XHU1M0Q2XHU2MjY5XHU1QzU1XHU1NDBEXHUzMDAxXHU2NTg3XHU0RUY2XHU4REVGXHU1Rjg0XHUzMDAxXHU4QkVEXHU4QTAwXHUzMDAxXHU4ODRDXHU1M0Y3XHU1NDhDXHU2ODA3XHU5ODk4XG4gICAgICAgIGNvbnN0IHsgZXh0ZW5zaW9uLCBmaWxlcGF0aCwgbGFuZywgbGluZXMsIHRpdGxlIH0gPSByYXdQYXRoVG9Ub2tlbihyZXNvbHZlZFBhdGgpO1xuXG4gICAgICAgIC8vIFx1NTIxQlx1NUVGQVx1NEVFM1x1NzgwMVx1NTc1N1x1NEVFNFx1NzI0Q1xuICAgICAgICBjb25zdCB0b2tlbiA9IG5ldyBzdGF0ZS5Ub2tlbignZmVuY2UnLCAnY29kZScsIDApO1xuICAgICAgICB0b2tlbi5pbmZvID0gYCR7bGFuZyB8fCBleHRlbnNpb259JHtsaW5lcyA/IGB7JHtsaW5lc319YCA6ICcnfSR7dGl0bGUgPyBgWyR7dGl0bGV9XWAgOiAnJ31gO1xuICAgICAgICB0b2tlbi5jb250ZW50ID0gYDw8PCAke2ZpbGVwYXRofWA7XG4gICAgICAgICh0b2tlbiBhcyBhbnkpLnNyYyA9IFtyZXNvbHZlZFBhdGhdO1xuICAgICAgICB0b2tlbkFycmF5LnB1c2godG9rZW4pO1xuXG4gICAgICAgIC8vIFx1NTIxQlx1NUVGQSA8dGVtcGxhdGU+IFx1N0VEM1x1Njc1Rlx1NjgwN1x1N0I3RVxuICAgICAgICBjb25zdCB0ZW1wbGF0ZUVuZCA9IG5ldyBzdGF0ZS5Ub2tlbignaHRtbF9pbmxpbmUnLCAnJywgMCk7XG4gICAgICAgIHRlbXBsYXRlRW5kLmNvbnRlbnQgPSAnPC90ZW1wbGF0ZT4nO1xuICAgICAgICB0b2tlbkFycmF5LnB1c2godGVtcGxhdGVFbmQpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFx1NTIxQlx1NUVGQSA8RGVtb1ByZXZpZXc+IFx1N0VEM1x1Njc1Rlx1NjgwN1x1N0I3RVxuICAgICAgY29uc3QgZW5kVGFnID0gbmV3IHN0YXRlLlRva2VuKCdodG1sX2lubGluZScsICcnLCAwKTtcbiAgICAgIGVuZFRhZy5jb250ZW50ID0gJzwvRGVtb1ByZXZpZXdHcm91cD4nO1xuICAgICAgdG9rZW5BcnJheS5wdXNoKGVuZFRhZyk7XG5cbiAgICAgIC8vIFx1NUMwNlx1NzUxRlx1NjIxMFx1NzY4NFx1NkEyMVx1Njc3Rlx1NTQ4Q1x1NEVFM1x1NzgwMVx1NTc1N1x1NEVFNFx1NzI0Q1x1NjNEMlx1NTE2NVx1NTIzMCBNYXJrZG93biBcdTRFRTRcdTcyNENcdTUyMTdcdTg4NjhcdTRFMkRcbiAgICAgIHN0YXRlLnRva2Vucy5zcGxpY2UoaW5kZXggKyAxLCAwLCAuLi50b2tlbkFycmF5KTtcblxuICAgICAgLy8gXHU4RkQ0XHU1NkRFXHU3QTdBXHU1QjU3XHU3QjI2XHU0RTMyXHVGRjBDXHU4ODY4XHU3OTNBXHU1REYyXHU1OTA0XHU3NDA2XHU1QjhDIDxEZW1vUHJldmlldz4gXHU2ODA3XHU3QjdFXG4gICAgICByZXR1cm4gJyc7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuZnVuY3Rpb24gZ2VuZXJhdGVDb250ZW50SGFzaChpbnB1dDogc3RyaW5nLCBsZW5ndGg6IG51bWJlciA9IDEwKTogc3RyaW5nIHtcbiAgLy8gXHU0RjdGXHU3NTI4IFNIQS0yNTYgXHU3NTFGXHU2MjEwXHU1NEM4XHU1RTBDXHU1MDNDXG4gIGNvbnN0IGhhc2ggPSBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMjU2JykudXBkYXRlKGlucHV0KS5kaWdlc3QoJ2hleCcpO1xuXG4gIC8vIFx1NUMwNlx1NTRDOFx1NUUwQ1x1NTAzQ1x1OEY2Q1x1NjM2Mlx1NEUzQSBCYXNlMzYgXHU3RjE2XHU3ODAxXHVGRjBDXHU1RTc2XHU1M0Q2XHU2MzA3XHU1QjlBXHU5NTdGXHU1RUE2XHU3Njg0XHU1QjU3XHU3QjI2XHU0RjVDXHU0RTNBXHU3RUQzXHU2NzlDXG4gIHJldHVybiBOdW1iZXIucGFyc2VJbnQoaGFzaCwgMTYpLnRvU3RyaW5nKDM2KS5zbGljZSgwLCBsZW5ndGgpO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFrWSxTQUFTLG9CQUFvQjtB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cUI7QUFBQSxVQUN4RCxFQUFFLE1BQU0sd0JBQXdCLE1BQU0sZ0JBQWdCO0FBQUEsUUFDeEQ7QUFBQSxNQUNGO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sT0FBTztBQUFBLFVBQ0wsRUFBRSxNQUFNLDRCQUFhLE1BQU0sb0JBQW9CO0FBQUEsVUFDL0MsRUFBRSxNQUFNLGdDQUFpQixNQUFNLHlCQUF5QjtBQUFBLFVBQ3hELEVBQUUsTUFBTSx5QkFBZSxNQUFNLHdCQUF3QjtBQUFBLFVBQ3JELEVBQUUsTUFBTSx3Q0FBb0IsTUFBTSwyQkFBMkI7QUFBQSxRQUMvRDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFFQSxhQUFhO0FBQUEsTUFDWCxFQUFFLE1BQU0sVUFBVSxNQUFNLHFDQUFxQztBQUFBLElBQy9EO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixVQUFVO0FBQUEsSUFDWjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFVBQVU7QUFBQSxJQUNSLFFBQVEsQ0FBQyxPQUFPO0FBQ2QsU0FBRyxJQUFJLGdCQUFnQjtBQUN2QixTQUFHLElBQUksZ0JBQWdCO0FBQ3ZCLFNBQUcsSUFBSSxzQkFBc0I7QUFBQSxJQUMvQjtBQUFBO0FBQUEsSUFFQSxPQUFPLEVBQUUsT0FBTyxnQkFBZ0IsTUFBTSxlQUFlO0FBQUEsRUFDdkQ7QUFBQSxFQUNBLE1BQU07QUFBQSxJQUNKLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsTUFDUCxRQUFRO0FBQUEsUUFDTixlQUFlLENBQUMsZUFBZSxlQUFlLGNBQWMsc0JBQXNCO0FBQUEsUUFDbEYsVUFBVTtBQUFBLFVBQ1IsTUFBTTtBQUFBLFVBQ04sWUFBWTtBQUFBLFVBQ1osYUFBYTtBQUFBLFVBQ2IsYUFBYTtBQUFBLFVBQ2IsT0FBTztBQUFBLFlBQ0w7QUFBQSxjQUNFLEtBQUs7QUFBQSxjQUNMLE9BQU87QUFBQSxjQUNQLE1BQU07QUFBQSxZQUNSO0FBQUEsWUFDQTtBQUFBLGNBQ0UsS0FBSztBQUFBLGNBQ0wsT0FBTztBQUFBLGNBQ1AsTUFBTTtBQUFBLFlBQ1I7QUFBQSxZQUNBO0FBQUEsY0FDRSxLQUFLO0FBQUEsY0FDTCxPQUFPO0FBQUEsY0FDUCxNQUFNO0FBQUEsY0FDTixTQUFTO0FBQUEsWUFDWDtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFDSDtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJkaXJuYW1lIiwgInJlc29sdmUiLCAicmVhZEZpbGVTeW5jIiwgInJlc29sdmUiLCAiZGlybmFtZSIsICJyZWFkRmlsZVN5bmMiLCAiZGlybmFtZSIsICJkaXJuYW1lIl0KfQo=
