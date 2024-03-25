<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2024-01-02 23:27:19
 * @LastEditors: caohao
 * @LastEditTime: 2024-03-25 13:38:40
-->
<template>
  <Space wrap>
    <Button type="primary">Primary Button</Button>
    <Button>Default Button</Button>
    <Button type="dashed">Dashed Button</Button>
    <Button type="text">Text Button</Button>
    <Button type="link">Link Button</Button>
  </Space>
</template>

<script setup lang="ts">
import { Space, Button } from 'ant-design-vue'
defineOptions({
  name: 'Demo',
})
</script>

<style></style>
