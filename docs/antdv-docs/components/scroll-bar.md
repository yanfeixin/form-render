---
outline: deep
---

# ScrollBar 滚动条

<!--@include: ./temp/warning.md-->

### 竖向滚动（默认）
:::preview 竖向滚动

demo-preview=../example/scroll/scroll-bar.vue

:::

### 横向滚动条

:::preview 横向滚动条

demo-preview=../example/scroll/scrollx-bar.vue

:::

### Props
| 属性名      | 描述                                  | 类型                 | 默认值      |
| ----------- | ------------------------------------- | -------------------- | ----------- |
| xScrollable | 是否开启横向滚动条                    | `boolean`            | `false`     |
| on-scroll   | 滚动的回调                            | `(e: Event) => void` | `undefined` |
| trigger     | 显示滚动条的时机，'none' 表示一直显示 | `'none'\|'hover'`    | `'hover'`   |
