import type { ExtractPublicPropTypes, PropType } from 'vue'

// eslint-disable-next-line unused-imports/no-unused-vars
const colors = ['success', 'processing', 'error', 'warning', 'default'] as const
export type colorType = (typeof colors)[number]
export const proTagProps = {
  options: {
    type: Array as PropType<
      {
        value: string | number | boolean
        label: string
        color: colorType
      }[]
    >,
    required: true
  }
} as const
export type TagProps = ExtractPublicPropTypes<typeof proTagProps>
