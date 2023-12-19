/*
 * @Author: caohao
 * @Date: 2023-12-04 13:46:47
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-19 16:56:02
 * @Description:
 */
import { withInstall } from '@king-one/utils/install'
import Button from './src/button.vue'
// export * from './src/button'
export const KButton = withInstall(Button) // 增加类型
export default KButton
