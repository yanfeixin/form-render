<script setup lang='ts'>
import { KProTitle } from '@king-one/antdv'
</script>

<template>
  <h4 style="margin-bottom: 10px;">
    基础用法
  </h4>
  <KProTitle title="测试一下" />
  <h4 style="margin-bottom: 10px;">
    设置大小和颜色
  </h4>
  <KProTitle title="测试一下" :size="14" color="red" />
  <h4 style="margin-bottom: 10px;">
    插槽
  </h4>
  <KProTitle title="测试一下">
    插槽内容
  </KProTitle>
</template>

<style>

</style>
