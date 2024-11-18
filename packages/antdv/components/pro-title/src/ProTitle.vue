<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@king-one/antdv/hooks/use-namespace'
import { KIcon } from '../../icon'
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
    <KIcon name="title-icon" class="icon" :size="size" :color="color" />
    <span :style="{ fontSize: `${size}px`, color }">{{ title }}</span>
    <slot />
  </div>
</template>
