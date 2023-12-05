/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2023-10-04 19:28:49
 * @LastEditors: caohao
 * @LastEditTime: 2023-10-17 13:46:19
 */
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
