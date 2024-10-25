<script setup lang="ts">
import { defaultNamespace } from '@king-one/antdv/hooks/use-namespace'
import { Modal } from 'ant-design-vue'
import { useModel } from 'vue'
import { uid } from '@king-one/utils/src/uid'
import { ProDialogProps } from './types'

defineOptions({
  name: 'ProDialog'
})
const props = defineProps(ProDialogProps)
const emits = defineEmits(['onConfirm', 'onCancel', 'update:modelValue'])
const uuid = uid()
const model = useModel(props, 'modelValue')
const handleClick = () => emits('onConfirm')
const handleCancel = () => emits('onCancel')
</script>

<template>
  <Modal
    v-model:open="model"
    :wrap-class-name="`${defaultNamespace}-pro-dialog`"
    @ok="handleClick"
    @cancel="handleCancel"
  >
    <div>
      {{ uuid }}
      <slot />
    </div>
  </modal>
</template>
