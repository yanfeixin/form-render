import type { PropType } from 'vue'

// const ProPickers = ['company', 'user', 'department', 'flowApplication'] as const
// export type ProPickerType = (typeof ProPickers)[number]
export enum PickerApiEnum {
  company = '/security/company/options',
  user = '/security/user/options',
  department = '/security/department/options',
  flowApplication = '/flow/application/options'
}
export type ProPickerType = keyof typeof PickerApiEnum
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
  delay: {
    type: Number,
    default: 200
  }
} as const

export interface ProPickerOption { label: string, value: string | number }

// 修改 ProPickerEmits 的定义
export interface ProPickerEmits {
  (e: 'change', value?: ProPickerOption | ProPickerOption[]): void
}
