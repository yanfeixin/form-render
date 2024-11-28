<script lang="ts" setup>
import { Table } from 'ant-design-vue'
import { useProModalInit } from '@king-one/antdv'
import ViewModal from './view.vue'

const [init, { openModal }] = useProModalInit()
function hadnleEdit() {
  openModal()
}
const columns = [
  {
    title: 'Name',
    dataIndex: 'name'
  },
  {
    title: 'Cash Assets',
    className: 'column-money',
    dataIndex: 'money'
  },
  {
    title: 'Address',
    dataIndex: 'address'
  },
  {
    title: '操作',
    dataIndex: 'action'
  }
]

const data = [
  {
    key: '1',
    name: 'John Brown',
    money: '￥300,000.00',
    address: 'New York No. 1 Lake Park'
  },
  {
    key: '2',
    name: 'Jim Green',
    money: '￥1,256,000.00',
    address: 'London No. 1 Lake Park'
  },
  {
    key: '3',
    name: 'Joe Black',
    money: '￥120,000.00',
    address: 'Sidney No. 1 Lake Park'
  }
]
</script>

<template>
  <Table :columns="columns" :data-source="data" bordered :pagination="false">
    <template #bodyCell="{ column }">
      <template v-if="column.dataIndex === 'action'">
        <a @click="hadnleEdit">编辑</a>
      </template>
    </template>
  </Table>
  <ViewModal @init="init" />
</template>
