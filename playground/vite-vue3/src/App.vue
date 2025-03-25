<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div style="padding: 20px;">
    <a-space>
      <a-button type="primary" @click="router.push('/')">
        昊哥专用
      </a-button>
      <a-button type="primary" @click="router.push('/table-filter')">
        表格/筛选组件
      </a-button>
      <a-button type="primary" @click="router.push('/flow-designer')">
        流程设计器
      </a-button>
    </a-space>
    <div style="margin-top: 20px;">
      <router-view />
    </div>
  </div>
</template>

<style scoped>

</style>
