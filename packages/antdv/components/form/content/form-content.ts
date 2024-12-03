import { type InjectionKey, inject, provide } from 'vue'
import type { FormItemProps } from '../component/form'

export interface FormItemContext extends FormItemProps {
  validate: (trigger: string) => Promise<any>
}
export const formItemContextKey: InjectionKey<FormItemContext>
    = Symbol('formItemContextKey')

export function useProvideFormItem(params: FormItemContext) {
  return provide(formItemContextKey, params)
}

export function useInjectFormItem() {
  return inject(formItemContextKey)
}
