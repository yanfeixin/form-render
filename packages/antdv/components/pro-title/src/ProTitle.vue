<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@king-one/antdv/hooks/use-namespace'
import { TitleProps } from './types'

defineOptions({
  name: 'ProTitle'
})
const props = defineProps(TitleProps)
const { b, m } = useNamespace('pro-title')
const c = computed(() => {
  if (props.unBorder) {
    return [b(), m('unborder')]
  }
  return [b()]
})
</script>

<template>
  <div :class="c">
    <span :style="{ fontSize: `${size}px` }">{{ title }}</span>
    <slot />
  </div>
</template>
