import type { ModalFuncProps, ModalProps } from 'ant-design-vue'
import type { PropType } from 'vue'

type ModalType = ModalFuncProps
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
