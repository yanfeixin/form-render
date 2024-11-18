<!-- eslint-disable no-console -->
<script setup lang="ts">
import { debounce } from 'lodash-es'
import { Select, Spin } from 'ant-design-vue'
import { reactive, watch } from 'vue'
import { proPickerApi } from '../apis/pro-picker.api'
import { ProPickerProps } from './types'

defineOptions({
  name: 'ProPicker'
})
const props = defineProps(ProPickerProps)
const value = defineModel<string | string[] | number | number[]>()
const state = reactive({
  data: [],
  fetching: false
})
watch(
  value,
  (value: string | string[] | number | number[] | undefined) => {
    if (!value)
      return
    const type = state.data.some((item: any) => item.value === value)
    if (type)
      return
    if (typeof value === 'string' || typeof value === 'number') {
      proPickerApi
        .company({
          params: { value }
        })
        .then((res) => {
          state.data = res.data.options.map((item: any) => ({
            label: item.label,
            value: item.value
          }))
        })
    }
    else if (Array.isArray(value)) {
      proPickerApi
        .company({
          params: { value: value.join(',') }
        })
        .then((res) => {
          state.data = res.data.options.map((item: any) => ({
            label: item.label,
            value: item.value
          }))
          state.fetching = false
        })
    }
  },
  {
    immediate: true
  }
)
const handleSearch = debounce((value: string) => {
  if (value) {
    state.fetching = true
    if (props.type === 'company') {
      proPickerApi
        .company({
          params: { label: value }
        })
        .then((res) => {
          state.data = res.data.options.map((item: any) => ({
            label: item.label,
            value: item.value
          }))
          state.fetching = false
        })
    }
    else {
      proPickerApi
        .user({
          params: { label: value }
        })
        .then(() => {})
    }
  }
}, props.delay)
</script>

<template>
  <Select
    v-model:value="value"
    :mode="mode"
    show-search
    :placeholder="placeholder"
    style="width: 100%"
    :filter-option="false"
    :not-found-content="state.fetching ? undefined : null"
    :options="state.data"
    @search="handleSearch"
  >
    <template v-if="state.fetching" #notFoundContent>
      <Spin size="small" />
    </template>
  </Select>
</template>
