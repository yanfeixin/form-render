import { computed, defineComponent, ref } from 'vue'
import { Modal } from 'ant-design-vue'
import { useNamespace } from '@king-one/antdv/hooks/use-namespace'
import { ProModalProps } from './types'

export default defineComponent({
  props: ProModalProps,
  emits: ['update:modelValue', 'onCancel', 'onConfirm'],
  setup(props, { slots, emit }) {
    const { b } = useNamespace('pro-modal')
    const c = computed(() => {
      return b()
    })
    const open = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        emit('update:modelValue', value)
      }
    })
    const handleClick = () => {
      emit('onConfirm')
    }
    const handleCancel = () => {
      emit('onCancel')
    }
    return () => (
      <Modal v-model:open={open.value} {...props.modalProps as any} onOk={handleClick} onCancel={handleCancel} wrap-class-name={c.value}>
        {{
          default: () => slots.default?.()
        }}
      </Modal>
    )
  }
})
