import type { UseVirtualListItem, UseVirtualListOptions } from '../hooks/useVirtualList'

export interface VirtualListProps {
  list: Array<any>
  option: UseVirtualListOptions
  itemClassName?: string
}
export interface VirtualListSlot {
  default: (props: { item: UseVirtualListItem<any>, index: number }) => any
}
