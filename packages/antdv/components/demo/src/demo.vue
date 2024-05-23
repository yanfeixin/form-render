<template>
  <div>
    <Space wrap>
      <Button type="primary">Primary Button</Button>
      <Button>Default Button</Button>
      <Button type="dashed">Dashed Button</Button>
      <Button type="text">Text Button</Button>
      <Button type="link">Link Button</Button>
    </Space>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { Button, Space } from 'ant-design-vue'
defineOptions({
  name: 'Demo'
})
</script>

<style></style>
