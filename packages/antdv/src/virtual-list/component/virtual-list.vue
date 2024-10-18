<script setup lang='ts'>
import { ref } from 'vue'
import {
  VVirtualList,
  type VirtualListInst,
  type VirtualListItemData
} from 'vueuc'
import { virtualListProps } from './types'

defineProps(virtualListProps)
const virtualListRef = ref<VirtualListInst | null>(null)
</script>

<template>
  <div>
    <VVirtualList
      ref="virtualListRef"
      :items="items"
      :item-size="itemSize"
      :key-field="keyField"
      :padding-top="paddingTop"
      :padding-bottom="paddingBottom"
      :item-resizable="itemResizable"
    >
      <template #default="{ item, index }">
        <slot :item="item" :index="index" />
      </template>
    </VVirtualList>
  </div>
</template>

<style>

</style>
