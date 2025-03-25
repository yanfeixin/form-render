<script setup lang="ts">
import { computed, inject, reactive, ref, watchEffect, toRefs, readonly, provide } from 'vue'
import {
  FIELD_CONTEXT_PROVIDE_KEY,
  TABLE_CONTEXT_PROVIDE_KEY
} from '../constants'
import type {
  ValueType,
  FieldOption,
  FormFieldSlotProps,
  FieldContextProvideType,
  ColumnInside
} from '../..'
import { handleFn, getAvailableVNode } from '../../utils'
// Components
import FieldInput from './field-input/field-input.vue'
import FieldSelect from './field-select/field-select.vue'
import FieldRadio from './field-radio/field-radio.vue'
import FieldDateRange from './field-date-range/field-date-range.vue'

const { column } = defineProps<{
  column: ColumnInside
}>()

const tableContext = inject(TABLE_CONTEXT_PROVIDE_KEY)!
const { tableSlots } = tableContext
const { formState } = toRefs(tableContext)

// TODO 处理 v-model 的问题, 是否要多层级, 和 table 保持一致还是增加单独的属性?
const formStateKey = column.dataIndex as string
const modelValue = computed({
  get() {
    return formState.value[formStateKey]
  },
  set(val) {
    formState.value[formStateKey] = val
  }
})

// @ts-ignore
const slotProps = reactive({
  column,
  value: modelValue.value,
  formState
}) as FormFieldSlotProps

// 是否具备展示 form item slot 的条件
const isShowFormItemSlot = computed(() => {
  if (tableSlots.formField) {
    return !!getAvailableVNode(tableSlots.formField(slotProps)).length
  }

  return false
})

const valueType = computed<ValueType>(
  () => column.valueType || (column.valueEnum ? 'select' : 'text')
)

// options
const fieldOptions = ref<FieldOption[]>([])
function handleOptionsInFirstTime() {
  if (column.request) {
    handleRequest()
  }
  else {
    handleValueEnum()
  }
}
handleOptionsInFirstTime()

watchEffect(() => {
  // eslint-disable-next-line vue/no-mutating-props
  column._fieldOptions = readonly(fieldOptions.value)
})

// valueEnum
function handleValueEnum() {
  if (column.valueEnum) {
    const valueEnumMap = new Map(Object.entries(column.valueEnum))

    fieldOptions.value = Array.from(valueEnumMap).map(([key, item]) => ({
      text: item.text,
      value: key,
      label: item.text,
      disabled: item.disabled
    }))
  }
}

// request
async function handleRequest() {
  const res = await handleFn(column.request, {})

  if (res) {
    fieldOptions.value = res
  }
}

const context = reactive<FieldContextProvideType>({
  fieldOptions,
  column
})

provide(
  FIELD_CONTEXT_PROVIDE_KEY,
  context as unknown as FieldContextProvideType
)
</script>

<template>
  <!-- eslint-disable vue/component-name-in-template-casing -->
  <div class="field">
    <template v-if="isShowFormItemSlot">
      <component :is="tableSlots.formField" v-bind="slotProps" />
    </template>
    <template v-else-if="column.customFormFieldRender">
      <column.customFormFieldRender v-bind="slotProps" />
    </template>
    <template v-else>
      <FieldInput v-if="valueType === 'text'" v-model="modelValue" />
      <FieldSelect v-if="valueType === 'select'" v-model="modelValue" />
      <FieldRadio v-if="valueType === 'radio'" v-model="modelValue" />
      <FieldDateRange v-if="valueType === 'dateRange'" v-model="modelValue" />
    </template>
  </div>
</template>

<style lang="scss">
  .field {
    .ant-picker {
      width: 100%;
    }
  }
</style>
