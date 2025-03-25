<script setup lang="ts">
import { inject, toRefs } from 'vue'
import { type RadioProps } from 'ant-design-vue'
import { FIELD_CONTEXT_PROVIDE_KEY } from '../../constants'

const modelValue = defineModel<any>('modelValue', {
  required: true
})

const fieldContext = inject(FIELD_CONTEXT_PROVIDE_KEY)!
const { fieldOptions, column } = toRefs(fieldContext)
</script>

<template>
  <div class="field-select">
    <!-- prettier-ignore-attribute v-bind -->
    <ARadioGroup
      v-model:value="modelValue"
      v-bind="(column.fieldProps as RadioProps)"
    >
      <ARadio
        v-for="opt in fieldOptions"
        :key="opt.value"
        :value="opt.value"
        :disabled="opt.disabled"
      >
        {{ opt.label }}
      </ARadio>
    </ARadioGroup>
  </div>
</template>

<style lang="scss"></style>
