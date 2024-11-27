<script setup lang='ts'>
import { ref } from 'vue'
import { KProModal } from '@king-one/antdv/components'

const open = ref<boolean>(false)
function showModal() {
  open.value = true
}
function handleConfirm() {
  open.value = false
}
</script>

<template>
  <div>
    <a-button type="primary" @click="showModal">
      Open Modal
    </a-button>
    <KProModal v-model="open" title="伟大的昊哥" :modal-props="{ okText: '666', maskClosable: false }" @on-confirm="handleConfirm">
      <div>默认内容</div>
    </KProModal>
  </div>
</template>

<style>

</style>
