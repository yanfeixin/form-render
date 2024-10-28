<script setup lang='ts'>
import { Modal } from 'ant-design-vue'
import { proDialogProps } from './types'

defineProps(proDialogProps)
const open = defineModel({ required: true, type: Boolean })
</script>

<template>
  <Modal v-model:open="open" v-bind="dialogProps" />
</template>

<style>

</style>
