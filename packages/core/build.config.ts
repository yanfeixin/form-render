/*
 * @Author: caohao
 * @Date: 2023-12-02 13:55:06
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-02 13:59:17
 * @Description:
 */
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
})
