<script setup lang='ts'>
import { useNamespace } from '@king-one/antdv/hooks/use-namespace'
import { computed } from 'vue'

defineOptions({ name: 'KForm' })
const { b } = useNamespace('form')
const c = computed(() => [b()])
</script>

<template>
  <form :class="c">
    <slot />
  </form>
</template>

<style>

</style>
