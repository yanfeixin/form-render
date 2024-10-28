import type { ModalProps } from 'ant-design-vue'
import type { PropType } from 'vue'

export const proDialogProps = {
  dialogProps: {
    type: Object as PropType<Omit<ModalProps, 'open'>>
  }
} as const
