import type { PropType } from 'vue'
import type {
  VirtualListItemData
} from 'vueuc'

export const virtualListProps = {
  items: {
    type: Array as PropType<VirtualListItemData[]>,
    default: () => []
  },
  itemSize: {
    type: Number,
    required: true
  },
  keyField: {
    type: String,
    default: 'key'
  },
  paddingTop: {
    type: [Number, String] as PropType<number | string>,
    default: 0
  },
  paddingBottom: {
    type: [Number, String] as PropType<number | string>,
    default: 0
  },
  itemResizable: Boolean
} as const
