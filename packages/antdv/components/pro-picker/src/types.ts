import type { PropType } from 'vue'

// eslint-disable-next-line unused-imports/no-unused-vars
const ProPickers = ['company', 'user'] as const
export type ProPickerType = (typeof ProPickers)[number]
export const ProPickerProps = {
  type: {
    type: String as PropType<ProPickerType>,
    default: 'company'
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  mode: {
    type: String as PropType< 'multiple' | 'tags' | 'SECRET_COMBOBOX_MODE_DO_NOT_USE'>
  },
  isInit: {
    type: Boolean
  },
  delay: {
    type: Number,
    default: 200
  }
} as const
