import type { ExtractPublicPropTypes, PropType } from 'vue'
import { TreeProps } from 'ant-design-vue'
export type Type = 'primary' | 'success' | 'warning' | 'danger' | 'info'
import type button from './button.vue'
import type { TypeWrapper } from '@king-one/utils'
type TreePropsWrapper = PropType<TypeWrapper<TreeProps>>
export const ButtonProps = {
  type: {
    type: String as PropType<Type>,
    default: 'default'
  },
  config: {
    type: Object as TreePropsWrapper
  }
}

export type ButtonPropsType = ExtractPublicPropTypes<typeof ButtonProps>
export type ButtonInstanceType = InstanceType<typeof button>
