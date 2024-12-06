import type MarkdownIt from 'markdown-it'
import type { Renderer, Token } from 'markdown-it'
import { isCheckPreviewCom1, isCheckPreviewCom2 } from './utils'
import { transformPreview } from './componentPreview'
import { containerDirectiveMount, parseContainer, parseContainerTag } from './containerPreview'

export * from './compoentGroup'
export function componentPreview(md: any) {
  const defaultHtmlInlineRender = md.renderer.rules.html_inline!
  md.renderer.rules.html_inline = (
    tokens: Token[],
    idx: number,
    options: MarkdownIt.Options,
    env: any,
    self: Renderer
  ) => {
    const token = tokens[idx]
    if (isCheckPreviewCom1.test(token.content) || isCheckPreviewCom2.test(token.content)) {
      return transformPreview(md, token, env)
    }
    return defaultHtmlInlineRender(tokens, idx, options, env, self)
  }
}

export function containerPreview(md: any) {
  // demoPreviewGroupPlugin(md)
  containerDirectiveMount(md)
  parseContainerTag(md)
  parseContainer(md)
}
// import { resolve } from 'node:path'

// export const aaa = resolve('./')
