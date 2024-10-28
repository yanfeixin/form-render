import { getCurrentInstance, ref, unref } from 'vue'

export interface DialogMethods {
  openDialog: () => void
  closeDialog: () => void
  // setFormInfo: (data: Record<string, unknown>) => void
}
export function useProDialog() {
  const dialogVisible = ref<boolean>(false)
  const openDialog = () => {
    dialogVisible.value = true
  }
  const closeDialog = () => {
    dialogVisible.value = false
  }
  const dialogMethods = {
    openDialog,
    closeDialog
  }
  const instance = getCurrentInstance()
  if (instance) {
    instance.emit('init', dialogMethods)
  }
  return { dialogVisible, openDialog, closeDialog }
}
export function useProDialogInit(): [
  (methods: DialogMethods) => void,
  DialogMethods
] {
  // const currentInstance = getCurrentInstance()
  const modalRef = ref<Nullable<DialogMethods>>(null)
  const getInstance = () => {
    const instance = unref(modalRef.value)
    if (!instance) {
      console.error('useModal instance is undefined!')
    }
    return instance
  }
  const initDialog = (modalInstance: DialogMethods) => {
    // currentInstance?.emit('init-modal', modalInstance)
    modalRef.value = modalInstance
  }
  const methods: DialogMethods = {
    openDialog: () => {
      getInstance()?.openDialog()
    },
    closeDialog: () => getInstance()?.closeDialog()
  }
  return [initDialog, methods]
}
