<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { KIcon, KProArea, KProPicker, KProSignature, KProTitle, KScrollBar, useProArea } from '@king-one/antdv/components'
import { onMounted, reactive, ref } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { FormPath } from '@king-one/path'
import Example from './example.vue'
import VirtualList from './App-virtualList.vue'
import AppForm from './App-form.vue'
// const open = ref<boolean>(false)
// function showModal() {
//   open.value = true
// }

// function handleOk(e: MouseEvent) {
//   console.log(e)
//   open.value = false
// }
const value = ref({ a: '' })
const value1 = reactive({ })
// const { ops } = useProArea()
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
  <a-config-provider :locale="zhCN">
    <!-- //color="#235399" -->
    <KIcon name="title-icon" />
    <a-button type="primary" @click="handleaaa">
      清空
    </a-button>
    <a-button type="primary" @click="handleEdit">
      回显
    </a-button>
    <KProPicker v-model="value.a" is-init />

    <!-- <KProArea
      v-model="value1" :options="ops" :field-names="{
        id: 'name',
      }"
    /> -->
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
        <!-- <KProArea v-model="formState.aaa" :options="ops" /> -->
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">
          Submit
        </a-button>
      </a-form-item>
    </a-form>
    <KProTitle title="测试一下" un-border />
    <!-- <div>
      <a-button type="primary" @click="showModal">
        Open Modal
      </a-button>
      <a-modal v-model:open="open" title="Basic Modal" @ok="handleOk">
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </a-modal>
    </div> -->
    <!-- <Example /> -->
    <Example />
    <KScrollBar style="max-height: 120px">
      我们在田野上面找猪<br>
      想象中已找到了三只<br>
      小鸟在白云上面追逐<br>
      它们在树底下跳舞<br>
      啦啦啦啦啦啦啦啦咧<br>
      啦啦啦啦咧<br>
      我们在想象中度过了许多年<br>
      想象中我们是如此的疯狂<br>
      我们在城市里面找猪<br>
      想象中已找到了几百万只<br>
      小鸟在公园里面唱歌<br>
      它们独自在想象里跳舞<br>
      啦啦啦啦啦啦啦啦咧<br>
      啦啦啦啦咧<br>
      我们在想象中度过了许多年<br>
      许多年之后我们又开始想象<br>
      啦啦啦啦啦啦啦啦咧
    </KScrollBar>
    <KScrollBar x-scrollable>
      <div style="white-space: nowrap; padding: 12px">
        我们在田野上面找猪 想象中已找到了三只 小鸟在白云上面追逐 它们在树底下跳舞
        啦啦啦啦啦啦啦啦咧 啦啦啦啦咧 我们在想象中度过了许多年
        想象中我们是如此的疯狂 我们在城市里面找猪 想象中已找到了几百万只
        小鸟在公园里面唱歌 它们独自在想象里跳舞 啦啦啦啦啦啦啦啦咧 啦啦啦啦咧
        我们在想象中度过了许多年 许多年之后我们又开始想象 啦啦啦啦啦啦啦啦咧
      </div>
    </KScrollBar>
    <VirtualList />
    <AppForm />
    <KProSignature />
    <div style="height: 300px;" />
  </a-config-provider>
</template>

<style>
body{
  width: 100vw;
  overflow:auto;
}
</style>
