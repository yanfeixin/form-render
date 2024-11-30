<script setup lang='ts'>
import { defaultNamespace } from '@king-one/antdv/hooks/use-namespace'
import { computed, ref, toRefs } from 'vue'
import { useElementBounding } from '@vueuse/core'
import { type UseVirtualListState, useVirtualList } from '../hooks/useVirtualList'
import type { VirtualListProps, VirtualListSlot } from './types'

const props = withDefaults(defineProps<VirtualListProps>(), {
  itemClassName: `${defaultNamespace}-scale-virtual-item`
})
const emit = defineEmits<{
  'update:state': [state: UseVirtualListState | null]
}>()

defineSlots<VirtualListSlot>()
const wrapperRef = ref<HTMLElement | null>(null)
const { width } = useElementBounding(wrapperRef)

const containerSty = computed(() => {
  return {
    width: `${width.value}px`
  }
})
const { list: Items } = toRefs(props)
const { list, containerProps, wrapperProps, scrollTo, scaleTo, state, onUpdate } = useVirtualList(Items, props.option)
defineExpose({
  scrollTo,
  scaleTo,
  state
})
onUpdate(value => emit('update:state', value))
</script>

<template>
  <div :class="`${defaultNamespace}-scale-virtual-list`" v-bind="containerProps">
    <div :class="`${defaultNamespace}-scale-virtual-list-container`" :style="containerSty">
      <div v-bind="wrapperProps" ref="wrapperRef" :class="`${defaultNamespace}-scale-vittual-wrapper aaa`">
        <div v-for="item in list" :key="item.index" :class="itemClassName">
          <slot :item="item" :index="item.index" />
        </div>
      </div>
    </div>
  </div>
</template>
