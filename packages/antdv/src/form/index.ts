/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2024-09-16 23:03:10
 * @LastEditors: caohao
 * @LastEditTime: 2024-09-17 00:25:55
 */
import { withInstall } from '@king-one/utils'
import form from './component/form.vue'

export * from './component/form'
export const KForm = withInstall(form) // 增加类型
export default KForm
