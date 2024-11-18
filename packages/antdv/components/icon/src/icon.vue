<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@king-one/antdv/hooks/use-namespace'
import { iconProps } from './types'

const props = defineProps(iconProps)

const { b } = useNamespace('icon')
const iconName = computed(() => `icon-king-${props.name}`)
const compStyle = computed(() => {
  return {
    fontSize: `${props.size}px`,
    color: props.color
  }
})
const c = computed(() => {
  return [b(), iconName.value]
})
</script>

<template>
  <i :class="c" :style="compStyle" />
</template>
