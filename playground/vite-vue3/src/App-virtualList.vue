<script setup lang='ts'>
import { computed, ref } from 'vue'
import { KScaleVirtualList } from '@king-one/antdv/components'
import { Button, Input } from 'ant-design-vue'

const virtualListRef = ref<InstanceType<typeof KScaleVirtualList> | null>(null)

const allItems = Array.from(Array.from({ length: 5 }).keys())
const filteredList = computed(() => allItems.map((_, index) => ({
  index,
  height: 852
})))
const Tscale = ref<number>(1)

const options = {
  itemHeight: () => 852
}

const current = ref<number>(0)
const page = ref(1)
function handlePage() {
  virtualListRef.value?.scrollTo(page.value - 1)
}
function handleAdd() {
  Tscale.value += 0.1
  virtualListRef.value?.scaleTo(Tscale.value)
}
function handleSub() {
  Tscale.value -= 0.1
  virtualListRef.value?.scaleTo(Tscale.value)
}
function handleUpdate(state) {
  current.value = state.current
}
function handlePrev() {
  virtualListRef.value?.scrollTo(current.value - 1)
}
function handleNext() {
  virtualListRef.value?.scrollTo(current.value + 1)
}
</script>

<template>
  <div style="width: 700px;">
    <div style="display: flex;">
      <span style="width: 200px;">跳转到指定页面:</span>
      <Input v-model:value="page" type="text" />
      <Button type="primary" @click="handlePage">
        GO
      </Button>
    </div>
    <div>
      <Button type="primary" size="small" @click="handleAdd">
        放大++
      </Button>
      <Button type="primary" size="small" @click="handleSub">
        缩小—-
      </Button>
      <Button type="primary" size="small" @click="handlePrev">
        上一个
      </Button>
      <Button type="primary" size="small" @click="handleNext">
        下一个
      </Button>
    </div>
    <KScaleVirtualList ref="virtualListRef" style="height: 300px;" :list="filteredList" :option="options" @update:state="handleUpdate">
      <template #default="{ index, item }">
        <div class="k-item" :style="{ height: `${item.data.height}px` }" :data-index="index">
          Row: {{ item.data.index + 1 }}
        </div>
      </template>
    </KScaleVirtualList>
    <div>
      <span>当前页码：</span>
      <a>{{ current + 1 }}</a>
    </div>
  </div>
</template>

<style>
.bbb{
  position: relative;
  margin: 0 auto;
}
.k-item{
  background: #fff;
  border: 1px solid red;
  width: 600px;
}
</style>
