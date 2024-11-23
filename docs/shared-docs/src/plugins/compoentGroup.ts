import type { MarkdownEnv, MarkdownRenderer } from 'vitepress';

import crypto from 'node:crypto';
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

export const rawPathRegexp =
  // eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/strict
  /^(.+?(?:\.([\da-z]+))?)(#[\w-]+)?(?: ?{(\d+(?:[,-]\d+)*)? ?(\S+)?})? ?(?:\[(.+)])?$/;

function rawPathToToken(rawPath: string) {
  const [
    filepath = '',
    extension = '',
    region = '',
    lines = '',
    lang = '',
    rawTitle = '',
  ] = (rawPathRegexp.exec(rawPath) || []).slice(1);

  const title = rawTitle || filepath.split('/').pop() || '';

  return { extension, filepath, lang, lines, region, title };
}

export const demoPreviewGroupPlugin = (md: MarkdownRenderer) => {
  md.core.ruler.after('inline', 'demo-preview', (state) => {
    const insertComponentImport = (importString: string) => {
      const index = state.tokens.findIndex(
        (i) => i.type === 'html_block' && i.content.match(/<script setup>/g),
      );
      if (index === -1) {
        const importComponent = new state.Token('html_block', '', 0);
        importComponent.content = `<script setup>\n${importString}\n</script>\n`;
        state.tokens.splice(0, 0, importComponent);
      } else {
        if (state.tokens[index]) {
          const content = state.tokens[index].content;
          state.tokens[index].content = content.replace(
            '</script>',
            `${importString}\n</script>`,
          );
        }
      }
    };
    // Define the regular expression to match the desired pattern
    const regex = /<DemoPreviewGroup\s+dir=['"]([^'"]+)['"]\s*\/?>/g;
    // const regex = /<DemoPreviewGroup[^>]*\sdir='([^"]*)'/g;
    // Iterate through the Markdown content and replace the pattern
    state.src.replaceAll(regex, (_match, dir) => {
      // console.log(dir)
      //  console.log(state.env)
      const path = state.env?.path

      const componentDir = join(dirname(path), dir).replaceAll(
        '\\',
        '/',
      );

      let childFiles: string[] = [];
      let dirExists = true;

      try {
        childFiles =
          readdirSync(componentDir, {
            encoding: 'utf8',
            recursive: false,
            withFileTypes: false,
          }) || [];
      } catch {
        dirExists = false;
      }
      if (!dirExists) {
        return '';
      }
      const uniqueWord = generateContentHash(componentDir);

      const ComponentName = `DemoComponent_${uniqueWord}`;
      insertComponentImport(
        `import ${ComponentName} from '${componentDir}/index.vue'`,
      );
      const { path: _path } = state.env as MarkdownEnv;

      // 查找匹配的 <DemoPreview> 标签在令牌列表中的位置
      const index = state.tokens.findIndex((i) => i.content.match(regex));
      // 如果没有找到匹配的标签，返回空字符串
      if (!state.tokens[index]) {
        return '';
      }

      // 将文件列表按特定顺序排序，确保 'index.vue' 位于最前面
      const firstString = 'index.vue';
      childFiles = childFiles.sort((a, b) => {
        if (a === firstString) return -1;
        if (b === firstString) return 1;
        return a.localeCompare(b, 'en', { sensitivity: 'base' });
      });
      // 更新 <DemoPreview> 标签的内容，包含文件列表和组件名称
      state.tokens[index].content = `<DemoPreviewGroup files="${encodeURIComponent(JSON.stringify(childFiles))}" ><${ComponentName}/>`;

      // 创建一个虚拟令牌，用于存储生成的模板和代码块
      const _dummyToken = new state.Token('', '', 0);
      const tokenArray: Array<typeof _dummyToken> = [];
      // 遍历文件列表，生成对应的模板和代码块
      childFiles.forEach((filename) => {
        // 创建 <template> 开始标签
        const templateStart = new state.Token('html_inline', '', 0);
        templateStart.content = `<template #${filename}>`;
        tokenArray.push(templateStart);

        // 构建文件的完整路径
        const resolvedPath = join(componentDir, filename);

        // 解析文件路径，获取扩展名、文件路径、语言、行号和标题
        const { extension, filepath, lang, lines, title } = rawPathToToken(resolvedPath);

        // 创建代码块令牌
        const token = new state.Token('fence', 'code', 0);
        token.info = `${lang || extension}${lines ? `{${lines}}` : ''}${title ? `[${title}]` : ''}`;
        token.content = `<<< ${filepath}`;
        (token as any).src = [resolvedPath];
        tokenArray.push(token);

        // 创建 <template> 结束标签
        const templateEnd = new state.Token('html_inline', '', 0);
        templateEnd.content = '</template>';
        tokenArray.push(templateEnd);
      });

      // 创建 <DemoPreview> 结束标签
      const endTag = new state.Token('html_inline', '', 0);
      endTag.content = '</DemoPreviewGroup>';
      tokenArray.push(endTag);

      // 将生成的模板和代码块令牌插入到 Markdown 令牌列表中
      state.tokens.splice(index + 1, 0, ...tokenArray);

      // 返回空字符串，表示已处理完 <DemoPreview> 标签
      return '';
    });
  });
};

function generateContentHash(input: string, length: number = 10): string {
  // 使用 SHA-256 生成哈希值
  const hash = crypto.createHash('sha256').update(input).digest('hex');

  // 将哈希值转换为 Base36 编码，并取指定长度的字符作为结果
  return Number.parseInt(hash, 16).toString(36).slice(0, length);
}
