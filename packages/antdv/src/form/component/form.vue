<!--
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2024-09-16 17:25:53
 * @LastEditors: caohao
 * @LastEditTime: 2024-09-16 22:49:04
-->
<script setup lang='ts'>
import { formType } from './form'

defineProps(formType)
</script>

<template>
  <form class="king-form">
    <slot />
  </form>
</template>

<style>

</style>
