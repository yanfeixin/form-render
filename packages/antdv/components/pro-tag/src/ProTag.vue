<script setup lang="ts">
import { computed } from 'vue'
import { Tag } from 'ant-design-vue'
import { proTagProps } from './types'

defineOptions({
  name: 'ProTag'
})
const props = defineProps(proTagProps)
const tag = defineModel<string | number | boolean | undefined>('tag', {
  required: true
})
const tagState = computed(() => {
  const data = props.options.find(item => item.value === tag.value)
  return data
})
</script>

<template>
  <Tag :color="tagState?.color || 'default'">
    {{ tagState?.label || '' }}
  </Tag>
</template>
