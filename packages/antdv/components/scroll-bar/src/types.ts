import type { PropType } from 'vue'

export const scrollbarProps = {
  container: Function as PropType<() => HTMLElement | null | undefined>,
  content: Function as PropType<() => HTMLElement | null | undefined>,
  onScroll: Function as PropType<(e: Event) => void>,
  xScrollable: Boolean
} as const
