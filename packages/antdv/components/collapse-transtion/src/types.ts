import type { ExtractPropTypes, PropType } from 'vue'

export const collapseProps = {
  mode: {
    type: String as PropType<'horizontal' | 'vertical'>,
    required: true
  }
} as const
export type ExtractProps = ExtractPropTypes<typeof collapseProps>
