import type { VirtualListInst, VirtualListItemData } from 'vueuc'
import type { PropType } from 'vue'

export interface InterScrollParams {
  viewportItems: any[]
  scrollTop: number
}
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
  xScrollable: Boolean,
  onScroll: Function as PropType<(params: InterScrollParams) => void>,
  onWheel: Function as PropType<(event: WheelEvent) => void>,
  onResize: Function as PropType<(entry: ResizeObserverEntry) => void>
} as const
export interface VirtualListRef extends VirtualListInst {
  viewportItems: any[]
  visibleItemsStyle: {
    transform: string
  }
}
