<script setup lang='ts'>
import { KForm, KFormItem } from '@king-one/antdv/components/form'
import { ref } from 'vue'

const value = ref<string>()
</script>

<template>
  <div>
    <KForm>
      <KFormItem>
        <a-input v-model:value="value" placeholder="Basic usage" />
      </KFormItem>
    </KForm>
  </div>
</template>

<style>

</style>
