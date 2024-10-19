import type { VirtualListItemData } from 'vueuc'
import type { PropType } from 'vue'

export const virtualListProps = {
  items: {
    type: Array as PropType<VirtualListItemData[]>,
    default: () => []
  },
  itemSize: {
    type: Number,
    required: true
  },
  itemResizable: Boolean,
  paddingTop: {
    type: [Number, String] as PropType<number | string>,
    default: 0
  },
  paddingBottom: {
    type: [Number, String] as PropType<number | string>,
    default: 0
  },
  keyField: {
    type: String,
    default: 'key'
  },
  onScroll: Function as PropType<() => void>,
  onWheel: Function as PropType<(event: WheelEvent) => void>,
  onResize: Function as PropType<(entry: ResizeObserverEntry) => void>
} as const
