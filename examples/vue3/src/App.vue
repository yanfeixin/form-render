<!--
 * @Author: caohao
 * @Date: 2023-12-05 19:45:03
 * @LastEditors: caohao
 * @LastEditTime: 2024-03-13 16:33:17
 * @Description: 
-->
<template>
  <HelloWorld></HelloWorld>
</template>

<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { FormPath } from '@king-one/path'
const target = {
  array: [
    { name: 1, age: 222 },
    { name: 2, age: 333 },
  ],
}

console.log(FormPath.getIn(target, 'array.[+].name')) //000
console.log(FormPath.parse('array.[0].name').match('array.*[].name'))
// console.log(FormPath.parse('array.*[].name').getIn(target))
// console.log(target) //{array:[{aa:'000'}]}
</script>

<style></style>
