/* eslint-disable ts/method-signature-style */
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { App, defineComponent } from 'vue'

  const component: ReturnType<typeof defineComponent> & {
    install(app: App): void
  }
  export default component
}
