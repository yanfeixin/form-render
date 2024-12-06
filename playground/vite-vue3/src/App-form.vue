<script setup lang='ts'>
import { KForm, KFormItem } from '@king-one/antdv/components/form'
import { ref } from 'vue'

const value = ref<string>('伟大的昊哥')
function handleChange(e: any) {
  value.value = e
}
</script>

<template>
  <div>
    <KForm>
      <KFormItem>
        <a-input :value="value" placeholder="Basic usage" @update:value="handleChange" />
      </KFormItem>
    </KForm>
    {{ value }}
  </div>
</template>

<style>

</style>
