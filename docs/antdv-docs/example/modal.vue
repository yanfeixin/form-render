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
      v-model="modalVisible" :modal-props="{ title: 'title' }"
    >
      测试内容
    </KProModal>
  </div>
</template>

<style>

</style>
