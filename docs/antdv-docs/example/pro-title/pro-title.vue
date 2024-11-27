<script setup lang='ts'>
import { KProTitle } from '@king-one/antdv'
</script>

<template>
  <div>基础用法</div>
  <KProTitle title="测试一下" />
  <hr>
  <div>设置大小和颜色</div>
  <KProTitle title="测试一下" :size="14" color="red" />

  <div>插槽</div>
  <KProTitle title="测试一下">
    插槽内容
  </KProTitle>
</template>

<style>

</style>
