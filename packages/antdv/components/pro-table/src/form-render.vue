<script setup lang="ts">
import { inject, toRefs, computed, ref, defineExpose } from 'vue'
import { type ColProps, type FormInstance } from 'ant-design-vue'
import type { Column } from '..'
import Field from './field/field.vue'
import { TABLE_CONTEXT_PROVIDE_KEY } from './constants'

const tableContext = inject(TABLE_CONTEXT_PROVIDE_KEY)!
const { columns, pageData, handleRequest } = tableContext
const { loading, antdFormProps, formColNum, formState, buttonCol }
    = toRefs(tableContext)

const formRef = ref<FormInstance>()

// 判断是否展示 formItem
function isShowItem(col: Column) {
  return col.valueType !== 'option' && !col.hideInForm
}

// TODO name 须要处理
const itemName = (col: Column) => col.dataIndex as string

function onFilter() {
  pageData.pageNum = 1
  handleRequest()
}

// 提交和重置
function onSubmit() {
  if (formRef.value) {
    formRef.value
      .validate()
      .then(() => {
        onFilter()
      })
      .catch(console.error)
  }
}
function resetForm() {
  if (formRef.value) {
    formRef.value.resetFields()
    onFilter()
  }
}

const colNum = computed(() => formColNum?.value || 0)
const colSpan = computed(() => 24 / colNum.value)
const buttonColOffset = computed(() => {
  const displayedColLen = columns.filter(isShowItem).length

  return (
    (colNum.value - 1 - (displayedColLen % colNum.value)) * colSpan.value
  )
})

function fieldCol(colProps?: ColProps, isButton: boolean = false) {
  colProps = {
    span: colSpan.value, // 4 列
    ...(colProps || {})
  }

  if (isButton && colProps.offset == null) {
    colProps.offset = buttonColOffset.value
  }

  return colProps
}

defineExpose({
  formRef
})
</script>

<template>
  <div class="pro-table-form">
    <AForm
      ref="formRef"
      autocomplete="off"
      :label-col="{ span: 5 }"
      v-bind="antdFormProps"
      :model="formState"
    >
      <ARow :gutter="[0, 24]">
        <!-- TODO 处理 key 的问题, 有的项没有 key, 有的项没有 dataIndex -->
        <template v-for="col in columns">
          <ACol
            v-if="isShowItem(col)"
            :key="col.key"
            v-bind="fieldCol(col.fieldCol)"
          >
            <AFormItem
              :label="col.title"
              :name="itemName(col)"
              v-bind="col.formItemProps"
            >
              <Field :column="col" />
            </AFormItem>
          </ACol>
        </template>
        <!-- 重置查询按钮 -->
        <ACol v-bind="fieldCol(buttonCol, true)">
          <AFormItem :wrapper-col="{ style: { textAlign: 'right' } }">
            <ASpace>
              <AButton @click="resetForm">
                重置
              </AButton>
              <AButton type="primary" :loading="loading" @click="onSubmit">
                查询
              </AButton>
            </ASpace>
          </AFormItem>
        </ACol>
      </ARow>
    </AForm>
  </div>
</template>

<style lang="scss">
  .pro-table {
    .pro-table-form {
      .ant-form {
        .ant-form-item {
          margin-bottom: 0;
        }
      }
    }
  }
</style>
