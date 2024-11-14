import { getCurrentInstance, ref, unref } from 'vue'

export interface modalMethods {
  openModal: () => void
  closeModal: () => void
  // setFormInfo: (data: Record<string, unknown>) => void
}
export function useProModal() {
  const modalVisible = ref<boolean>(false)
  const openModal = () => {
    modalVisible.value = true
  }
  const closeModal = () => {
    modalVisible.value = false
  }
  const modalMethods = {
    openModal,
    closeModal
  }
  const instance = getCurrentInstance()
  if (instance) {
    instance.emit('init', modalMethods)
  }
  return { modalVisible, openModal, closeModal }
}
export function useProModalInit(): [
  (methods: modalMethods) => void,
  modalMethods
] {
  // const currentInstance = getCurrentInstance()
  const modalRef = ref<Nullable<modalMethods>>(null)
  const getInstance = () => {
    const instance = unref(modalRef.value)
    if (!instance) {
      console.error('useModal instance is undefined!')
    }
    return instance
  }
  const initmodal = (modalInstance: modalMethods) => {
    // currentInstance?.emit('init-modal', modalInstance)
    modalRef.value = modalInstance
  }
  const methods: modalMethods = {
    openModal: () => {
      getInstance()?.openModal()
    },
    closeModal: () => getInstance()?.closeModal()
  }
  return [initmodal, methods]
}
