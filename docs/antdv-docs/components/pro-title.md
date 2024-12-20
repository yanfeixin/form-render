---
outline: deep
---

# ProTitle 标题

<!--@include: ./temp/warning.md-->

### 基础用法
:::preview

demo-preview=../example/pro-title/pro-title.vue

:::

### Props
| 属性名   | 描述                              | 类型      | 是否必传 | 默认值    |
| -------- | --------------------------------- | --------- | -------- | --------- |
| title    | 标题名                            | `string`  | 是       | -         |
| size     | 大小                              | `number`  | 否       | `20`      |
| color    | 颜色                              | `string`  | 否       | `#0e74ff` |
| unBorder | 是否显示下边框，'true' 表示不显示 | `boolean` | 否       | `false`   |

### Slots
| 名称    | 参数 | 说明     | 版本 |
| ------- | ---- | -------- | ---- |
| default | ()   | 默认内容 | -    |
