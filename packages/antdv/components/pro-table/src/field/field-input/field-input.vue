<script setup lang="ts">
import { type InputProps } from 'ant-design-vue'
import { inject } from 'vue'
import { FIELD_CONTEXT_PROVIDE_KEY } from '../../constants'

const modelValue = defineModel<any>('modelValue', {
  required: true
})

const fieldContext = inject(FIELD_CONTEXT_PROVIDE_KEY)!
const { column } = fieldContext
</script>

<template>
  <div class="field-input">
    <!-- prettier-ignore-attribute v-bind -->
    <AInput
      v-model:value="modelValue"
      v-bind="(column.fieldProps as InputProps)"
    />
  </div>
</template>

<style lang="scss"></style>
