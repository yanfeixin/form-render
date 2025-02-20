---
outline: deep
---

# Picker 选择器

<!--@include: ../temp/warning.md-->

::: danger

- 此组件为远程搜索组件，内部封装并调用了用户中心相关接口。
- 请把业务系统的请求封装挂载到 window.$http
:::

### 基础用法
```vue
<script setup lang='ts'>
import { KProPicker } from '@king-one/antdv/components'
const value = ref('')
</script>

<template>
  <KProPicker v-model="value" />
</template>
```

### Props
| 属性名 | 描述                                     | 类型                                                   | 默认值    |
| ------ | ---------------------------------------- | ------------------------------------------------------ | --------- |
| type   | 选择器的类型，调用不同的接口获取远程数据 | `company(企业)\|user(用户)\|flowApplication(流程应用)` | `company` |
| delay  | 输入搜索时的防抖时间                     | `number`                                               | `200`     |
| mode   | 选择器的类型                             | `multiple(多选)\|null(单选)`                           | `null`    |
