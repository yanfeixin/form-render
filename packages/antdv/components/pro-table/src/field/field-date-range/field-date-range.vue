<script setup lang="ts">
import { inject, toRefs } from 'vue'
import { FIELD_CONTEXT_PROVIDE_KEY } from '../../constants'

const modelValue = defineModel<any>('modelValue', {
  required: true
})

const fieldContext = inject(FIELD_CONTEXT_PROVIDE_KEY)!
const { column } = toRefs(fieldContext)
</script>

<template>
  <div class="field-date-range">
    <!-- prettier-ignore-attribute v-bind -->
    <ARangePicker
      v-model:value="modelValue"
      v-bind="(column.fieldProps as any)"
    />
  </div>
</template>

<style lang="scss"></style>
