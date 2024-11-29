<script setup lang='ts'>
import { KProArea } from '@king-one/antdv'
import { reactive } from 'vue'

// eslint-disable-next-line prefer-const
let value = reactive({})

const ops = [
  {
    name: '山东',
    id: '0-0',
    children: [
      {
        name: '济南',
        id: '0-0-0',
        children: [
          { name: '历城区', id: '0-0-0-0' },
          { name: '历下区', id: '0-0-0-1' }
        ]
      },
      {
        name: '菏泽',
        id: '0-0-1',
        children: [{ id: '0-0-1-0', name: '巨野县' }]
      }
    ]
  }
]
</script>

<template>
  <KProArea v-model="value" :options="ops" />
  {{ value }}
</template>

<style>

</style>
