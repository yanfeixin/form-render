import type { ModalFuncProps, ModalProps } from 'ant-design-vue'
import type { PropType } from 'vue'

type ModalType = ModalFuncProps & {
  confirmLoading?: boolean
}
export const ProModalProps = {
  modalProps: {
    type: Object as PropType<Omit<ModalType, 'open' | 'title'>>
  },
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  }
} as const

// import type { ModalFuncProps, ModalProps } from 'ant-design-vue'
// import type { PropType } from 'vue'

// type MPType = ModalProps
// export const ProModalProps = {
//   modalProps: {
//     type: Object as PropType<Omit<MPType, 'open'>>
//   },
//   mProps: {
//     type: Object as PropType<{ name: string }>
//   }
// } as const

export interface ProModalSlots {
  /**
   * 自定义标题
   */
  title?: () => any
  /**
   * 自定义页脚
   */
  footer?: () => any
  /**
   * 默认插槽
   */
  default?: () => any
}
