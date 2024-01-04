/*
 * @Author: caohao
 * @Date: 2023-12-04 13:46:47
 * @LastEditors: caohao
 * @LastEditTime: 2024-01-03 17:27:30
 * @Description:
 */
import { withInstall } from '@king-one/utils'
import Demo from './src/demo.vue'
// export * from './src/button'
export const KDemo = withInstall(Demo) // 增加类型
export default KDemo
