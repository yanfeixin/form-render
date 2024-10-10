/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2024-09-16 17:25:58
 * @LastEditors: caohao
 * @LastEditTime: 2024-09-16 22:46:07
 */
import type {
  RuleItem
} from 'async-validator'
import type { PropType } from 'vue'

export const formType = {
  model: {
    type: Object
  },
  rules: {
    type: Object as PropType<Record<string, RuleItem[]>>
  }
} as const
