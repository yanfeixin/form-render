import type { ExtractPropTypes, PropType } from 'vue'
export type Type = 'primary' | 'success' | 'warning' | 'danger' | 'info'
import type button from './button.vue'
export const ButtonProps = {
  type: {
    type: String as PropType<Type>,
    default: 'default',
  },
}

export type ButtonPropsType = ExtractPropTypes<typeof ButtonProps>
export type ButtonInstanceType = InstanceType<typeof button>
