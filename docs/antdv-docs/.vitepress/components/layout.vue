<script setup lang='ts'>
import { nextTick, onMounted, watch } from 'vue'
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/locale/zh_CN'
import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import { useRoute } from 'vitepress'

const route = useRoute()

watch(
  () => route.path,
  () => nextTick(() => initZoom())
)

function initZoom() {
  // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' });
  mediumZoom('.VPContent img', { background: 'var(--vp-c-bg)' })
}
onMounted(() => {
  initZoom()
})

const { Layout } = DefaultTheme
</script>

<template>
  <div>
    <ConfigProvider :locale="zhCN">
      <Layout />
    </ConfigProvider>
  </div>
</template>

<style>
.medium-zoom-overlay,
.medium-zoom-image--opened {
  z-index: 2147483647;
}
</style>
