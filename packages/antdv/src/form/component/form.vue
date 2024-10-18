<!--
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2024-09-16 17:25:53
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-10-15 16:47:20
-->
<script setup lang='ts'>
import { formType } from './form'

defineProps(formType)
</script>

<template>
  <form class="king-form">
    <div>伟大的好歌</div>
    <slot />
  </form>
</template>

<style>

</style>
