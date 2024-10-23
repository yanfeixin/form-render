<script setup lang="ts">
import { onMounted, ref, toRaw } from 'vue'
import { VVirtualList, type VirtualListScrollToOptions } from 'vueuc'
import { debounce } from 'lodash-es'
import scrollbar from '../../scroll-bar'
import { type VirtualListRef, virtualListProps } from './types'

const props = defineProps(virtualListProps)
const virtualListInstRef = ref<VirtualListRef | null>(null)
const scrollbarInstRef = ref<InstanceType<typeof scrollbar> | null>(null)
function getScrollContainer(): HTMLElement | null | undefined {
  return virtualListInstRef.value?.listElRef
}
function getScrollContent(): HTMLElement | null | undefined {
  return virtualListInstRef.value?.itemsElRef
}
const syncScrollbar = () => scrollbarInstRef.value?.sync()
const debouncedLogViewportItems = debounce(() => {
  if (virtualListInstRef.value) {
    const scrollTop = virtualListInstRef.value.listElRef.scrollTop
    const viewportItems = virtualListInstRef.value.viewportItems.map(item => toRaw(item))

    props.onScroll?.({ viewportItems, scrollTop })
  }
}, 100)
function handleScroll() {
  debouncedLogViewportItems()
  syncScrollbar()
}
onMounted(() => {
  setTimeout(() => {
    syncScrollbar()
  }, 100)
})
// 使用防抖函数包裹 console.log

function handleResize() {
  syncScrollbar()
}
function scrollTo(
  options: VirtualListScrollToOptions | number,
  y?: number
): void {
  if (typeof options === 'number') {
    virtualListInstRef.value?.scrollTo(options, y ?? 0)
  }
  else {
    virtualListInstRef.value?.scrollTo(options)
  }
}
defineExpose({
  getScrollContainer,
  getScrollContent,
  scrollTo
})
</script>

<template>
  <scrollbar ref="scrollbarInstRef" style="max-height: 300px" :x-scrollable="xScrollable" :container="getScrollContainer" :content="getScrollContent">
    <VVirtualList
      ref="virtualListInstRef"
      :items="items"
      style="height: 100%"
      :item-size="itemSize"
      :item-resizable="itemResizable"
      :show-scrollbar="false"
      :padding-bottom="paddingBottom"
      :padding-top="paddingTop"
      :on-scroll="handleScroll"
      :on-resize="handleResize"
    >
      <template #default="{ item, index }">
        <slot :item="item" :index="index" />
      </template>
    </VVirtualList>
  </scrollbar>
</template>

<style></style>
