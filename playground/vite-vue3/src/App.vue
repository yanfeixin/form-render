<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { KProArea, KProPicker, KProTitle, useProArea } from '@king-one/antdv/components'
import { onMounted, reactive, ref } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'

const value = ref({ a: '' })
const value1 = reactive({ })
const { ops } = useProArea()
function handleAdd() {
  console.log(value1)
}
interface FormState {
  username: string
  password: string
  aaa: {
    province?: string
    city?: string
    county?: string
  }
}

const formState = reactive<FormState>({
  username: '',
  password: '',
  aaa: {}
})
function onFinish(values: any) {
  console.log('Success:', values)
}

function onFinishFailed(errorInfo: any) {
  console.log('Failed:', errorInfo)
}
async function aaavalidator(_rule: Rule, value: any) {
  if (!value.province) {
    return Promise.reject(new Error('请选择省市区'))
  }
  return Promise.resolve()
}
onMounted(() => {
  setTimeout(() => {
    Object.assign(value1, {
      province: '北京',
      city: '北京市',
      county: '丰台区'
    })
  }, 200)
})
function handleEdit() {
  value.value.a = '1856582762272702464'
}
function handleaaa() {
  value.value.a = ''
}
</script>

<template>
  <a-button type="primary" @click="handleaaa">
    清空
  </a-button>
  <a-button type="primary" @click="handleEdit">
    回显
  </a-button>
  <KProPicker v-model="value.a" is-init />
  <KProTitle title="伟大的昊哥" un-border />
  <KProArea
    v-model="value1" :options="ops" :field-names="{
      id: 'name',
    }"
  />
  <div>{{ value1 }}</div>
  <div @click="handleAdd">
    123
  </div>

  <a-form
    :model="formState"
    name="basic"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    autocomplete="off"
    @finish="onFinish"
    @finish-failed="onFinishFailed"
  >
    <a-form-item
      label="Username"
      name="username"
      :rules="[{ required: true, message: 'Please input your username!' }]"
    >
      <a-input v-model:value="formState.username" />
    </a-form-item>

    <a-form-item
      label="Password"
      name="aaa"
      :rules="[{ required: true, message: 'Please input your password!' }, {
        validator: aaavalidator, trigger: 'change',
      }]"
    >
      <KProArea v-model="formState.aaa" :options="ops" />
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" html-type="submit">
        Submit
      </a-button>
    </a-form-item>
  </a-form>
</template>

<style></style>
