---
outline: deep
---

# VirtualList 虚拟列表

::: warning 写在前面

如果你觉得现有组件的封装不够理想，或者不完全符合你的需求，大可以直接使用原生组件，亦或亲手封装一个适合的组件。框架提供的组件并非束缚，使用与否，完全取决于你的需求与自由。

:::

### 基础用法
:::preview 基本用法 || 支持放大、缩小、跳转到指定页面

demo-preview=../example/virtual-list/base.vue

:::

### Props
| 属性名        | 描述                             | 类型                    | 是否必传 | 默认值 |
| ------------- | -------------------------------- | ----------------------- | -------- | ------ |
| list          | 数据源                           | `Array<any>`            | 是       | -      |
| option        | [配置项](#useVirtualListOptions) | `UseVirtualListOptions` | 是       | -      |
| itemClassName | 虚拟列表每个Item的className      | `string`                | 否       | -      |

### Methods
| 方法名   | 说明           | 参数                       | 版本 |
| -------- | -------------- | -------------------------- | ---- |
| scaleTo  | 缩放比例       | `(s: number) => void`      | -    |
| scrollTo | 滚动到指定位置 | ` (index: number) => void` | -    |

### Events
| 时间名         | 说明                       | 参数                  | 版本 |
| -------------- | -------------------------- | --------------------- | ---- |
| `update:state` | 虚拟列表初始化或滚动时触发 | Function(state:[UseVirtualListState](#UseVirtualListState) ) | -    |

### <a id="useVirtualListOptions"></a>UseVirtualListOptions类型

```ts
type UseVirtualListItemSize = number | ((index: number) => number)

export interface UseVerticalVirtualListOptions extends UseVirtualListOptionsBase {
  /**
   * item height, accept a pixel value or a function that returns the height
   *
   * @default 0
   */
  itemHeight: UseVirtualListItemSize
}

export interface UseVirtualListOptionsBase {
  /**
   * the extra buffer items outside of the view area
   *
   * @default 5
   */
  overscan?: number
}

export type UseVirtualListOptions = UseHorizontalVirtualListOptions | UseVerticalVirtualListOptions
```

### UseVirtualListState类型 {#UseVirtualListState}

:sunglasses: :sunglasses:

```ts
export interface UseVirtualListState {
  start: number
  end: number
  current: number
  scale: number
}
```
