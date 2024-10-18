/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2024-09-16 23:03:10
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-10-15 17:11:16
 */
import { withInstall } from '@king-one/utils/src/install'
import form from './component/form.vue'

export * from './component/form'
export const KForm = withInstall(form) // 增加类型
export default KForm
