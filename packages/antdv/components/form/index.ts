import { withInstall } from '../utils/install'
import form from './component/form.vue'

export * from './component/form'
export const KForm = withInstall(form) // 增加类型
export default KForm
