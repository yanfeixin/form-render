# ProSignature 手写签名

<!--@include: ./temp/warning.md-->

### 基础用法
:::preview

demo-preview=../example/pro-signature.vue

:::

### Props
| 属性名    | 描述                                                         | 类型      | 必传 | 默认值      |
| :-------- | :----------------------------------------------------------- | :-------- | :--- | :---------- |
| width     | 签名区域宽度                                                 | `string`  | 否   | `800`       |
| height    | 签名区域高度                                                 | `number`  | 否   | `300`       |
| lineWidth | 画笔宽度                                                     | `number`  | 否   | `4`         |
| lineColor | 画笔颜色                                                     | `string`  | 否   | `#000000`   |
| isCrop    | 是否裁剪签名区域                                             | `boolean` | 否   | `false`     |
| bgColor   | 画布背景颜色                                                 | `string`  | 否   | -           |
| type      | 导出图片格式（支持 `image/png`、`image/jpeg`、`image/webp`） | `string`  | 否   | `image/png` |
| quality   | 导出图片质量（0-1之间）                                      | `number`  | 否   | `1`         |

### Methods
| 方法名   | 说明           | 参数                    | 版本 |
| -------- | -------------- | ----------------------- | ---- |
| generate | 生成图片base64 | `() => Promise<string>` | -    |
| reset    | 清空画布       | ` () => void`           | -    |
