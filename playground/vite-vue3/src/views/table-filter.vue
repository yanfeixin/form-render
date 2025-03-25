<script setup lang="ts">
import { KProTable } from '@king-one/antdv/components'
import type { Column, TableRequest, TableRequestParams, ValueEnum } from '@king-one/antdv/components/pro-table'
import { h, ref } from 'vue'
import { Button } from 'ant-design-vue'

interface DataType {
  key: string
  name: string
  status: number
  address: string
  tags: string[]
}

const valueEnum: ValueEnum = {
  all: { text: '全部', status: 'Default' },
  close: { text: '关闭', status: 'Default' },
  running: { text: '运行中', status: 'Processing', disabled: true },
  online: { text: '已上线', status: 'Success' },
  error: { text: '异常', status: 'Error' }
}

const columns = ref<Column<DataType>[]>([
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    initialValue: 'Initial value',
    fieldProps: {
      allowClear: true
    }
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    valueType: 'select',
    valueEnum,
    fieldProps: {
      allowClear: true
    }
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    hideInForm: true
  },
  {
    title: 'Hide in table',
    dataIndex: 'hideInTable',
    key: 'hideInTable',
    hideInTable: true,
    formItemProps: {
      labelCol: {
        class: 'ant-col-8',
        style: { background: 'red' }
      }
    }
  },
  {
    title: 'Render',
    dataIndex: 'render',
    key: 'render',
    hideInTable: true,
    customFormFieldRender: ({ column, formState }) => [
      h('input', {
        value: formState[column.dataIndex as string],
        onInput: (e: any) => {
          formState[column.dataIndex as string] = e.target.value
        },
        wfull: ''
      })
    ]
  },
  {
    title: 'Slot',
    dataIndex: 'slot',
    key: 'slot',
    hideInTable: true,
    // 优先级小于 slot
    customFormFieldRender: ({ column }) =>
      h('span', { b: '1px solid black' }, `- ${column.key} | render -`)
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    valueType: 'radio',
    fieldProps: {
      disabled: true
    },
    customRender: ({ index }) => h('i', `Tag ${index}`),
    request: async () => {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve()
        }, 1500)
      })

      return [
        { label: 'Label A', value: 'a' },
        { label: 'Label B', value: 'b' }
      ]
    }
  },
  {
    title: 'Select',
    key: 'select',
    dataIndex: 'select',
    valueType: 'select',
    // customRender: (scope) => h('span', scope.labelText),
    request: async () => {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve()
        }, 1500)
      })

      return [
        { label: 'Select A', value: 'a' },
        { label: 'Select B', value: 'b' }
      ]
    }
  },
  {
    title: 'Cascader',
    dataIndex: 'cascader',
    key: 'cascader',
    fieldCol: {
      span: 9
    }
  },
  {
    title: 'Action',
    key: 'action',
    valueType: 'option',
    customRender: () => [
      h(Button, { type: 'link', size: 'small' }, () => '操作'),
      h(Button, { type: 'link', size: 'small', danger: true }, () => '删除')
    ]
  }
])

const proTableRef = ref()

const formDisabled = ref(false)
function toggleDisableForm() {
  formDisabled.value = !formDisabled.value
}

function onAddCol() {
  const key = randomKey()
  // @ts-ignore
  columns.value.push({
    title: 'Add',
    key,
    dataIndex: key
  })
}

function randomKey() {
  return (new Date().valueOf() + Math.ceil(Math.random() * 10000)).toString()
    + Math.random().toString(16).substring(2, 15)
}

const request: TableRequest = async (params) => {
  // eslint-disable-next-line no-console
  console.log(params)

  await new Promise<TableRequestParams>((resolve) => {
    setTimeout(() => {
      resolve(params)
    }, 1000)
  })

  const randomBoolean = Math.random() > 0.5

  return {
    data: [
      {
        key: '1',
        name: 'John Brown',
        status: 'close',
        address: randomKey(),
        tags: ['nice', 'developer'],
        select: randomBoolean ? 'a' : 'b'
      },
      {
        key: '2',
        name: 'Jim Green',
        status: 'online',
        address: randomKey(),
        tags: ['loser'],
        select: randomBoolean ? 'a' : 'b'
      },
      {
        key: '3',
        name: 'Joe Black',
        status: 'error',
        address: randomKey(),
        tags: ['cool', 'teacher'],
        select: randomBoolean ? 'b' : 'a'
      }
    ],
    success: true,
    total: 100
  }
}
</script>

<template>
  <div style="margin: 30px;border: 1px solid #000;padding: 20px">
    <ASpace mb16px>
      <Button @click="onAddCol">
        添加一列
      </Button>
      <Button @click="toggleDisableForm">
        切换表单禁用状态
      </Button>
    </ASpace>
    <KProTable
      ref="proTableRef"
      :columns="(columns as Column<DataType>[])"
      :form-col-num="3"
      :request="request"
      :antd-form-props="{
        disabled: formDisabled,
        rules: {
          status: [{ required: true }],
        },
      }"
      :antd-table-props="{
        bordered: true,
      }"
      :button-col="{
        span: 7,
        offset: 0,
      }"
      hide-form
    />
  </div>
</template>

<style scoped>

</style>
