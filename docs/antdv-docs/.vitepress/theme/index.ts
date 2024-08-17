// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import '@king-one/shared-docs/src/component/styles/theme.scss'
// import { Demo } from '@king-one/shared-docs/src/components'
import { AntDesignContainer, NaiveUIContainer } from '@king-one/shared-docs/src/component'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  // eslint-disable-next-line unused-imports/no-unused-vars
  enhanceApp({ app, router, siteData }) {
    // app.component('Demo', Demo)
    app.component('demo-preview', AntDesignContainer)
    // ...
  }
} satisfies Theme
