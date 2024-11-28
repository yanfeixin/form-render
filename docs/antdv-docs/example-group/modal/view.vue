<script setup lang='ts'>
import { KProModal, useProModal } from '@king-one/antdv'

const { modalVisible } = useProModal()
</script>

<template>
  <KProModal v-model="modalVisible" title="默认">
    默认内容
  </KProModal>
</template>

<style>

</style>
