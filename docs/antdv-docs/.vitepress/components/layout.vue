<script setup lang='ts'>
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/locale/zh_CN'
import DefaultTheme from 'vitepress/theme'

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

</style>
