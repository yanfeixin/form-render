<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2023-10-04 19:27:03
 * @LastEditors: caohao
 * @LastEditTime: 2024-03-25 13:34:41
-->
<template>
  <div :class="classes" style="width: 100px">我是一个button</div>
</template>

<script setup lang="ts">
import { ButtonProps } from './button'
import { computed } from 'vue'
import { useNamespace } from '@king-one/hooks'
defineOptions({
  name: 'Button',
})
const props = defineProps(ButtonProps)
const ns = useNamespace('button')
const classes = computed(() => {
  const { type } = props
  return [ns.b(), ns.m(type)]
})
</script>

<style></style>
