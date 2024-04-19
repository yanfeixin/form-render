/*
 * @Author: caohao
 * @Date: 2023-12-04 13:46:47
 * @LastEditors: caohao
 * @LastEditTime: 2024-03-29 14:45:28
 * @Description:
 */
import { withInstall } from '@king-one/utils'
import Demo from './src/demo.vue'
// import Demo from "@king-one/antdv/components/demo/src/demo.vue"
// export * from './src/button'
export const KDemo = withInstall(Demo) // 增加类型
export default KDemo
