<script setup lang='ts'>
import { computed, nextTick, ref } from 'vue'
import { useVirtualList } from './useVirtualList'
// import { useVirtualList } from '@vueuse/core'
function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min // 包含min和max
}

const allItems = Array.from(Array.from({ length: 100 }).keys())
const filteredList = computed(() => allItems.map((_, index) => ({
  index,
  height: 1000
})))
// const scale = ref<number>(1)
const { list, containerProps, wrapperProps, scrollTo, scale } = useVirtualList(
  filteredList,
  {
    itemHeight: i => filteredList.value[i].height
  }
)

const page = ref(1)
function handlePage() {
  scrollTo(+page.value)
}
function handleAdd() {
  scale.value += 0.1
}
function handleSub() {
  scale.value -= 0.1
}
</script>

<template>
  <div>
    <input v-model="page" type="text">
    <button @click="handlePage">
      toggle
    </button>
    <button @click="handleAdd">
      ++
    </button>
    <button @click="handleSub">
      --
    </button>
    <div v-bind="containerProps" style="height: 750px" class="asd">
      <div v-bind="wrapperProps" :style="{ transform: `scale(${scale})`, transformOrigin: '50% 0' }">
        <div v-for="item in list" :key="item.index" class="item" :style="{ height: `${item.data.height}px` }">
          Row: {{ item.data }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.item{
  background: #fff;
  margin-bottom: 10px;
  border: 1px solid red;
  width: 800px;
}
</style>
