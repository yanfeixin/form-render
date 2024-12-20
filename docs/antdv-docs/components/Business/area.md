---
outline: deep
---

# ProArea 省市区

<!--@include: ../temp/warning.md-->

::: danger 注意

- 此组件只是省市区，不包含详细地址
- 此组件可以通过useProArea方法获取省市区数据
- useProArea方法内部封装了系统配置中心相关接口
- 使用useProArea方式时，请确保系统配置中心已配置好省市区数据，请把业务系统的请求封装挂载到 window.$http

:::

### 基础用法
:::preview 自定义提供省市区数据

demo-preview=../../example/pro-area/area.vue

:::

### 通过useProArea获取省市区数据

```vue
<script setup lang='ts'>
import { KProArea, useProArea } from '@king-one/antdv'
import { reactive } from 'vue'

const value = reactive({})
const { ops } = useProArea()
</script>

<template>
  <KProArea v-model="value" :options="ops" />
  {{ value }}
</template>
```

### Props
| 属性名     | 描述                                      | 类型                                              | 是否必传 | 默认值                                         |
| ---------- | ----------------------------------------- | ------------------------------------------------- | -------- | ---------------------------------------------- |
| options    | 省市区数据源                              | [AreaOptions](#AreaOptions)[]                     | 是       |                                                |
| level      | 省市区级别                                | `1（一级：省）\|2（两级：省市）\|3(三级：省市区)` | 是       | 3                                              |
| fieldNames | AreaOptions中id,name,children的对应的字段 | [FieldNames](#FieldNames)                         | 否       | `{name: 'name',id: 'id',children: 'children'}` |

### AreaOptions类型 {#AreaOptions}

:sunglasses: :sunglasses:

```ts
export interface AreaOptions {
  /** 展示文本 */
  name?: string
  /** 值 */
  id?: string
  /** 子节点 */
  children?: AreaOptions[]
  [key: PropertyKey]: any
}
```

### FieldNames类型 {#FieldNames}

:sunglasses: :sunglasses:

```ts
export type FieldNames = {
  [K in keyof Pick<AreaOptions, 'name' | 'id' | 'children'>]?: string;
}
```
