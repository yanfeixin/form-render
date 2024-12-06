// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import '../../../components/src/styles/theme.scss'
import { AntDesignContainer, DemoPreviewGroup } from '../../../components/index'
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
