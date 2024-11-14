import type { FormInstance } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'
import { type Ref, getCurrentInstance, ref, unref } from 'vue'

export interface ModalMethods {
  setFormData: (data: object) => void
}
export function useProForm<T>(init: T) {
  // const initialState = () => JSON.parse(JSON.stringify(init))
  const ruleForm = ref(init) as Ref<T>
  const formRef = ref<FormInstance>()
  const currentInstance = getCurrentInstance()
  const setFormData = (data: any) => {
    ruleForm.value = cloneDeep(data)
  }
  const resetForm = () => {
    // ruleForm.value = init
    ruleForm.value = init
    formRef.value?.resetFields()
  }
  const modalMethods = {
    setFormData
  }
  if (currentInstance) {
    currentInstance?.emit('initForm', modalMethods)
  }
  return {
    ruleForm,
    formRef,
    resetForm
  }
}

export function useProFormInit(): [
  (methods: ModalMethods) => void,
  ModalMethods
] {
  // const currentInstance = getCurrentInstance()
  const modalRef = ref<Nullable<ModalMethods>>(null)
  const getInstance = () => {
    const instance = unref(modalRef.value)
    if (!instance) {
      console.error('useModal instance is undefined!')
    }
    return instance
  }
  const initForm = (modalInstance: ModalMethods) => {
    modalRef.value = modalInstance
  }
  const methods: ModalMethods = {
    setFormData: data => getInstance()?.setFormData(data)
  }
  return [initForm, methods]
}
