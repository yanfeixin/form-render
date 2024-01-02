<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2024-01-02 09:44:34
 * @LastEditors: caohao
 * @LastEditTime: 2024-01-02 17:29:12
-->
<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="`#${name}`"></use>
  </svg>
</template>

<script lang="ts" setup>
  defineProps<{
    name: string;
  }>();
</script>

<style scoped lang="scss">
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
