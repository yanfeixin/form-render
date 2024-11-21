<script setup lang='ts'>
import { Modal, type ModalProps } from 'ant-design-vue'
import { useNamespace } from '@king-one/antdv/hooks/use-namespace'
import { computed } from 'vue'

import { ProModalProps } from './types'

defineOptions({
  name: 'ProModal'
})
defineProps(ProModalProps)
const emit = defineEmits(['onConfirm', 'onCancel'])

const open = defineModel({ required: true, type: Boolean })

const { b } = useNamespace('pro-modal')
const c = computed(() => {
  return b()
})

function handleClick() {
  emit('onConfirm')
}
function handleCancel() {
  emit('onCancel')
}
</script>

<template>
  <Modal
    v-model:open="open" v-bind="modalProps as any" :wrap-class-name="c" @ok="handleClick"
    @cancel="handleCancel"
  >
    <slot />
  </Modal>
</template>
