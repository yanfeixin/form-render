---
outline: deep
---

# ScrollBar 滚动条

::: warning 写在前面

如果你觉得现有组件的封装不够理想，或者不完全符合你的需求，大可以直接使用原生组件，亦或亲手封装一个适合的组件。框架提供的组件并非束缚，使用与否，完全取决于你的需求与自由。

:::

### 竖向滚动（默认）
:::preview 竖向滚动

demo-preview=../example/modal/scroll-bar.vue

:::

### 横向滚动条

:::preview 横向滚动条

demo-preview=../example/modal/scrollx-bar.vue

:::

### Props
| 属性名      | 描述                                  | 类型                 | 默认值      |
| ----------- | ------------------------------------- | -------------------- | ----------- |
| xScrollable | 是否开启横向滚动条                    | `boolean`            | `false`     |
| on-scroll   | 滚动的回调                            | `(e: Event) => void` | `undefined` |
| trigger     | 显示滚动条的时机，'none' 表示一直显示 | `'none'\|'hover'`    | `'hover'`   |
