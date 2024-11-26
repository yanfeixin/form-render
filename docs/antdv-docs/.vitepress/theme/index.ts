// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import '@king-one/shared-docs/src/component/styles/theme.scss'
// import { Demo } from '@king-one/shared-docs/src/components'
import { AntDesignContainer, DemoPreviewGroup } from '@king-one/shared-docs/src/component'
// import DemoPreviewGroup from '../components/demo-preview-group.vue'
import layout from '../components/layout.vue'

export default {
  extends: DefaultTheme,
  Layout: layout,
  // eslint-disable-next-line unused-imports/no-unused-vars
  enhanceApp({ app, router, siteData }) {
    // app.component('Demo', Demo)
    app.component('demo-preview', AntDesignContainer)
    app.component('DemoPreviewGroup', DemoPreviewGroup)
    // ...
  }
} satisfies Theme
