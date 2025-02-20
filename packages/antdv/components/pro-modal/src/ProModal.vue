<script setup lang='ts'>
import { Button, Modal } from 'ant-design-vue'
import { useNamespace } from '@king-one/antdv/hooks/use-namespace'
import type { CSSProperties } from 'vue'
import { computed, ref, watch, watchEffect } from 'vue'
import { useDraggable } from '@vueuse/core'
import type { ProModalSlots } from './types'
import { ProModalProps } from './types'

defineOptions({
  name: 'ProModal'
})
defineProps(ProModalProps)
const emit = defineEmits(['onConfirm', 'onCancel'])
defineSlots<ProModalSlots>()
const modalTitleRef = ref<HTMLElement | null>(null)
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

const { x, y, isDragging } = useDraggable(modalTitleRef)
const startX = ref<number>(0)
const startY = ref<number>(0)
const startedDrag = ref(false)
const transformX = ref(0)
const transformY = ref(0)
const preTransformX = ref(0)
const preTransformY = ref(0)
const dragRect = ref({ left: 0, right: 0, top: 0, bottom: 0 })
watch([x, y], () => {
  if (!startedDrag.value && modalTitleRef.value) {
    startX.value = x.value
    startY.value = y.value
    const bodyRect = document.body.getBoundingClientRect()
    const titleRect = modalTitleRef.value.getBoundingClientRect()
    dragRect.value.right = bodyRect.width - titleRect.width
    dragRect.value.bottom = bodyRect.height - titleRect.height
    preTransformX.value = transformX.value
    preTransformY.value = transformY.value
  }
  startedDrag.value = true
})
watch(isDragging, () => {
  if (!isDragging) {
    startedDrag.value = false
  }
})
watchEffect(() => {
  if (startedDrag.value) {
    transformX.value
      = preTransformX.value
      + Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right)
      - startX.value
    transformY.value
      = preTransformY.value
      + Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom)
      - startY.value
  }
})
const transformStyle = computed<CSSProperties>(() => {
  return {
    transform: `translate(${transformX.value}px, ${transformY.value}px)`
  }
})
</script>

<template>
  <Modal
    v-model:open="open" v-bind="(modalProps as any)" :wrap-class-name="c" @ok="handleClick"
    @cancel="handleCancel"
  >
    <template #title>
      <div ref="modalTitleRef" class="pro-modal-title">
        {{ title }}
      </div>
    </template>
    <slot />
    <template #modalRender="{ originVNode }">
      <div :style="transformStyle">
        <component :is="originVNode" />
      </div>
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </Modal>
</template>
