/*
 * @Author: caohao
 * @Date: 2023-12-04 13:46:47
 * @LastEditors: caohao
 * @LastEditTime: 2024-01-02 23:29:51
 * @Description:
 */
import { withInstall } from '@king-one/utils/install'
import Demo from './src/demo.vue'
// export * from './src/button'
export const KDemo = withInstall(Demo) // 增加类型
export default KDemo
