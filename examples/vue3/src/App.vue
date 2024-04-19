<!--
 * @Author: caohao
 * @Date: 2023-12-05 19:45:03
 * @LastEditors: caohao
 * @LastEditTime: 2024-04-19 16:21:04
 * @Description: 
-->
<template>
  <HelloWorld></HelloWorld>
  <input ref="input" type="file" @change="changeFile" />
</template>

<script setup lang="ts">
import { MinioClient } from '@king-one/file'
import HelloWorld from './components/HelloWorld.vue'
const client = new MinioClient({
  baseUrl: '/api',
  // token: '123',
  token: '6621c9bfbf223314240eed09',
  bucket: 'sign',
  business: 'chtest',
})
const changeFile = (event: any) => {
  const file = event.target.files[0]
  console.log(file)
  client
    .upload(file)
    .then((_res) => {
      debugger
    })
    .catch((_err) => {
      debugger
    })
}
// import { FormPath } from '@king-one/path'

// const target = {
//   array: [
//     { name: 1, age: 222 },
//     { name: 2, age: 333 },
//   ],
// }

// console.log(FormPath.getIn(target, 'array.[+].name')) //000
// console.log(FormPath.parse('array.[0].name').match('array.*[].name'))
// console.log(FormPath.parse('array.*[].name').getIn(target))
// console.log(target) //{array:[{aa:'000'}]}
</script>

<style></style>
