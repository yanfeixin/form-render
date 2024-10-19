<script setup lang="ts">
import { ref } from 'vue'
import { VVirtualList, type VirtualListInst } from 'vueuc'
import scrollbar from '../../scroll-bar'
import { virtualListProps } from './types'

const props = defineProps(virtualListProps)
const virtualListInstRef = ref<VirtualListInst | null>(null)
const scrollbarInstRef = ref<InstanceType<typeof scrollbar> | null>(null)
function getScrollContainer(): HTMLElement | null | undefined {
  return virtualListInstRef.value?.listElRef
}
function getScrollContent(): HTMLElement | null | undefined {
  return virtualListInstRef.value?.itemsElRef
}
const syncScrollbar = () => scrollbarInstRef.value?.sync()
function handleScroll() {
  props.onScroll?.()
  syncScrollbar()
}
function handleResize() {
  syncScrollbar()
}
</script>

<template>
  <scrollbar ref="scrollbarInstRef" style="max-height: 300px" :container="getScrollContainer" :content="getScrollContent">
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
