import type {
  RuleItem,
  ValidateError,
  ValidateFieldsError
} from 'async-validator'
import type { ExtractPropTypes, PropType } from 'vue'

export type Arrayable<T> = T | T[]

export interface FormItemRule extends RuleItem {
  trigger?: Arrayable<string>
}

export const definePropType = <T>(val: any): PropType<T> => val
export const formItemProps = {
  label: String,
  prop: String,
  rules: {
    // type: [Object, Array] as Arrayable<FormItemRule> // 优化前语法，即使类型不正确，也会被强行断言成正确的

    type: definePropType<Arrayable<FormItemRule>>([Object, Array]) // 优化后语法 根据返回类型，确保正确性
  }
} as const
export type FormItemProps = ExtractPropTypes<typeof formItemProps> // 根据Props定义一个面向组件内部的值，面向内部表示Boolean和带有默认的props是一个被定义好的值
