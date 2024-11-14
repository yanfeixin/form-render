<script setup lang='ts'>
import { computed, ref } from 'vue'
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
  height: 100
})))
// const scale = ref<number>(1) // scale, scaleTo, state
const Tscale = ref<number>(1)
const { list, containerProps, wrapperProps, scrollTo, scaleTo, state } = useVirtualList(
  filteredList,
  {
    itemHeight: 100
  }
)

const page = ref(1)
function handlePage() {
  scrollTo(+page.value)
}
function handleAdd() {
  Tscale.value += 0.1
  scaleTo(Tscale.value)
  // scaleTo(Tscale.value)
  // handleScale(scale.value)
}
function handleSub() {
  Tscale.value -= 0.1
  scaleTo(Tscale.value)
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
    <div v-bind="containerProps" style="height: 300px;width: 800px;" class="asd">
      <div class="bbb">
        <div
          v-bind="wrapperProps" style="position: absolute;left: 50%;"
        >
          <div v-for="item in list" :key="item.index" class="item" :style="{ height: `${item.data.height}px` }" :data-index="item.index">
            Row: {{ item.data }}
          </div>
        </div>
      </div>
    </div>
    <div>{{ state.current }}</div>
  </div>
</template>

<style>
.bbb{
  position: relative;
  margin: 0 auto;
}
.item{
  background: #fff;
  border: 1px solid red;
  width: 600px;
}
</style>
