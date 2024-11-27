<script setup lang='ts'>
import { Button } from 'ant-design-vue'
import { KProModal, useProModal } from '@king-one/antdv'

const { modalVisible } = useProModal()
</script>

<template>
  <div>
    <Button type="primary" @click="modalVisible = true">
      open Modal
    </Button>
    <KProModal
      v-model="modalVisible"
      title="伟大的昊哥"
    >
      测试内容
    </KProModal>
  </div>
</template>

<style>

</style>
