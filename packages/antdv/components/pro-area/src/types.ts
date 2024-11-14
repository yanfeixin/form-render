/* eslint-disable unused-imports/no-unused-vars */
import type { PropType } from 'vue'

export type FieldNames = {
  [K in keyof Pick<AreaOptions, 'name' | 'id' | 'children'>]?: string;
}

const level = [1, 2, 3] as const
export type levelType = (typeof level)[number]
export interface AreaOptions {
  /** 展示文本 */
  name?: string
  /** 值 */
  id?: string
  /** 子节点 */
  children?: AreaOptions[]
  [key: PropertyKey]: any
}
// Models
export interface ArearModelsType {
  /** 所选的值 */
  modelValue: {
    province?: string
    city?: string
    county?: string
  }
}

export const ProAreaProps = {
  level: {
    type: Number as PropType<levelType>,
    default: 3
  },
  options: {
    type: Array as PropType<AreaOptions[]>,
    required: true
  },
  fieldNames: {
    type: Object as PropType<FieldNames>,
    default: () => ({
      name: 'name',
      id: 'id',
      children: 'children'
    })
  }
} as const
