/*
 * @Author: caohao
 * @Date: 2023-12-04 13:46:47
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-08 17:37:21
 * @Description:
 */
import { withInstall } from '@king-one/utils/install'
import Button from './src/button.vue'
// import Button from '@king-one/components/button/src/button.vue'
export const KButton = withInstall(Button) // 增加类型
