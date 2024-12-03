import { withInstall } from '../utils/install'
import Form from './component/form.vue'
import FormItem from './component/form-item.vue'

export * from './component/form'
export const KForm = withInstall(Form) // 增加类型
export const KFormItem = withInstall(FormItem) // 增加类型
export default KForm
