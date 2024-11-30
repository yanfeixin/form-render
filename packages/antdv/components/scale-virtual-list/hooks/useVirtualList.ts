import { type EventHookOn, type MaybeRef, createEventHook } from '@vueuse/shared'
import type { ComputedRef, Ref, ShallowRef, StyleValue } from 'vue-demi'
import { computed, ref, shallowRef, watch } from 'vue-demi'
import { useElementSize } from '@vueuse/core'

export interface UseVirtualListState { start: number, end: number, current: number, scale: number }

type RefState = Ref<UseVirtualListState>
type UseVirtualListItemSize = number | ((index: number) => number)

export interface UseHorizontalVirtualListOptions extends UseVirtualListOptionsBase {

  /**
   * item width, accept a pixel value or a function that returns the width
   *
   * @default 0
   */
  itemWidth: UseVirtualListItemSize

}

export interface UseVerticalVirtualListOptions extends UseVirtualListOptionsBase {
  /**
   * item height, accept a pixel value or a function that returns the height
   *
   * @default 0
   */
  itemHeight: UseVirtualListItemSize
}

export interface UseVirtualListOptionsBase {
  /**
   * the extra buffer items outside of the view area
   *
   * @default 5
   */
  overscan?: number
}

export type UseVirtualListOptions = UseHorizontalVirtualListOptions | UseVerticalVirtualListOptions

export interface UseVirtualListItem<T> {
  data: T
  index: number
}

export interface UseVirtualListReturn<T> {
  onUpdate: EventHookOn<UseVirtualListState | null>
  state: RefState
  list: Ref<UseVirtualListItem<T>[]>
  scrollTo: (index: number) => void
  scaleTo: (s: number) => void
  containerProps: {
    ref: Ref<HTMLElement | null>
    onScroll: () => void
    style: StyleValue
  }
  wrapperProps: ComputedRef<{
    style: {
      height: string
      marginTop: string
      transform: string
      transformOrigin: string
    } | {
      width: string
      height: string
      marginLeft: string
      display: string
      transform: string
      transformOrigin: string
    }
  }>
}

/**
 * Please consider using [`vue-virtual-scroller`](https://github.com/Akryum/vue-virtual-scroller) if you are looking for more features.
 */
export function useVirtualList<T = any>(list: MaybeRef<T[]>, options: UseVirtualListOptions): UseVirtualListReturn<T> {
  const { containerStyle, wrapperProps, scrollTo, calculateRange, currentList, containerRef, scaleTo, state, onUpdate } = 'itemHeight' in options
    ? useVerticalVirtualList(options, list)
    : useHorizontalVirtualList(options, list)

  return {
    onUpdate,
    state,
    scaleTo,
    list: currentList,
    scrollTo,
    containerProps: {
      ref: containerRef,
      onScroll: () => {
        calculateRange()
      },
      style: containerStyle
    },
    wrapperProps
  }
}

type UseVirtualListContainerRef = Ref<HTMLElement | null>

interface UseVirtualElementSizes {
  width: Ref<number>
  height: Ref<number>
}

type UseVirtualListArray<T> = UseVirtualListItem<T>[]
type UseVirtualListRefArray<T> = Ref<UseVirtualListArray<T>>

type UseVirtualListSource<T> = Ref<T[]> | ShallowRef<T[]>

interface UseVirtualListResources<T> {
  state: RefState
  source: UseVirtualListSource<T>
  currentList: UseVirtualListRefArray<T>
  size: UseVirtualElementSizes
  containerRef: UseVirtualListContainerRef
}

function useVirtualListResources<T>(list: MaybeRef<T[]>): UseVirtualListResources<T> {
  const containerRef = ref<HTMLElement | null>(null)
  const size = useElementSize(containerRef)

  const currentList: Ref<UseVirtualListItem<T>[]> = ref([])
  const source = shallowRef(list)

  const state: Ref<UseVirtualListState> = ref({ start: 0, end: 10, current: 0, scale: 1 })

  return { state, source, currentList, size, containerRef }
}

function createGetViewCapacity<T>(state: UseVirtualListResources<T>['state'], source: UseVirtualListResources<T>['source'], itemSize: UseVirtualListItemSize) {
  return (containerSize: number) => {
    const { start = 0, scale = 1 } = state.value
    if (typeof itemSize === 'number')
      return Math.ceil(containerSize / (itemSize * scale))

    let sum = 0
    let capacity = 0
    for (let i = start; i < source.value.length; i++) {
      const size = itemSize(i) * scale
      sum += size
      capacity = i
      if (sum > containerSize)
        break
    }
    return capacity - start
  }
}
// 根据滚动条获取索引
function createGetOffset<T>(source: UseVirtualListResources<T>['source'], itemSize: UseVirtualListItemSize, state: UseVirtualListResources<T>['state']) {
  return (scrollDirection: number) => {
    const { scale = 1 } = state.value
    if (typeof itemSize === 'number')
      return Math.floor(scrollDirection / (itemSize * scale)) + 1

    let sum = 0
    let offset = 0

    for (let i = 0; i < source.value.length; i++) {
      const size = itemSize(i) * scale
      sum += size
      if (sum >= scrollDirection) {
        offset = i
        break
      }
    }
    return offset + 1
  }
}

function createCalculateRange<T>(type: 'horizontal' | 'vertical', overscan: number, getOffset: ReturnType<typeof createGetOffset>, getViewCapacity: ReturnType<typeof createGetViewCapacity>, { containerRef, state, currentList, source }: UseVirtualListResources<T>, updateTrigger) {
  return () => {
    const element = containerRef.value
    if (element) {
      const offset = getOffset(type === 'vertical' ? element.scrollTop : element.scrollLeft)
      const viewCapacity = getViewCapacity(type === 'vertical' ? element.clientHeight : element.clientWidth)

      const from = offset - overscan
      const to = offset + viewCapacity + overscan

      state.value = {
        start: from < 0 ? 0 : from,
        end: to > source.value.length
          ? source.value.length
          : to,
        current: offset,
        scale: state.value.scale
      }
      currentList.value = source.value
        .slice(state.value.start, state.value.end)
        .map((ele, index) => ({
          data: ele,
          index: index + state.value.start
        }))
      updateTrigger(state.value)
    }
  }
}
// 获取距离
function createGetDistance<T>(itemSize: UseVirtualListItemSize, source: UseVirtualListResources<T>['source'], state: UseVirtualListResources<T>['state']) {
  return (index: number) => {
    const { scale = 1 } = state.value
    if (typeof itemSize === 'number') {
      const size = index * (itemSize * scale)
      return size
    }

    const size = source.value
      .slice(0, index)
      .reduce((sum, _, i) => sum + itemSize(i) * scale, 0)

    return size
  }
}

function useWatchForSizes<T>(size: UseVirtualElementSizes, list: MaybeRef<T[]>, containerRef: Ref<HTMLElement | null>, calculateRange: () => void) {
  watch([size.width, size.height, list, containerRef], () => {
    calculateRange()
  })
}
// 获取总高度
function createComputedTotalSize<T>(itemSize: UseVirtualListItemSize, source: UseVirtualListResources<T>['source'], state: UseVirtualListResources<T>['state']) {
  return computed(() => {
    const { scale = 1 } = state.value
    if (typeof itemSize === 'number')
      return source.value.length * itemSize * scale

    return source.value.reduce((sum, _, index) => sum + itemSize(index) * scale, 0)
  })
}

const scrollToDictionaryForElementScrollKey = {
  horizontal: 'scrollLeft',
  vertical: 'scrollTop'
} as const

function createScrollTo<T>(type: 'horizontal' | 'vertical', calculateRange: () => void, getDistance: ReturnType<typeof createGetDistance>, containerRef: UseVirtualListResources<T>['containerRef']) {
  return (index: number) => {
    if (containerRef.value) {
      containerRef.value[scrollToDictionaryForElementScrollKey[type]] = getDistance(index)
      calculateRange()
    }
  }
}

function useHorizontalVirtualList<T>(options: UseHorizontalVirtualListOptions, list: MaybeRef<T[]>) {
  const { on: onUpdate, trigger: updateTrigger } = createEventHook()
  const resources = useVirtualListResources(list)
  const { state, source, currentList, size, containerRef } = resources
  const containerStyle: StyleValue = { overflowX: 'auto' }

  const { itemWidth, overscan = 5 } = options

  const getViewCapacity = createGetViewCapacity(state, source, itemWidth)

  const getOffset = createGetOffset(source, itemWidth, state)

  const calculateRange = createCalculateRange('horizontal', overscan, getOffset, getViewCapacity, resources, updateTrigger)

  const getDistanceLeft = createGetDistance(itemWidth, source, state)

  const offsetLeft = computed(() => getDistanceLeft(state.value.start))

  const totalWidth = createComputedTotalSize(itemWidth, source, state)

  useWatchForSizes(size, list, containerRef, calculateRange)

  const scrollTo = createScrollTo('horizontal', calculateRange, getDistanceLeft, containerRef)
  const scaleTo = (s: number) => {
    state.value.scale = s
  }
  const wrapperProps = computed(() => {
    return {
      style: {
        height: '100%',
        width: `${totalWidth.value - offsetLeft.value}px`,
        marginLeft: `${offsetLeft.value}px`,
        display: 'flex',
        transform: `scale(${state.value.scale})`,
        transformOrigin: '0% 0%'
        // position: 'absolute',
        // left: '50%'
      }
    }
  })

  return {
    onUpdate,
    state,
    scaleTo,
    scrollTo,
    calculateRange,
    wrapperProps,
    containerStyle,
    currentList,
    containerRef
  }
}

function useVerticalVirtualList<T>(options: UseVerticalVirtualListOptions, list: MaybeRef<T[]>) {
  const { on: onUpdate, trigger: updateTrigger } = createEventHook()
  const resources = useVirtualListResources(list)

  const { state, source, currentList, size, containerRef } = resources

  const containerStyle: StyleValue = { overflowY: 'auto' }

  const { itemHeight, overscan = 5 } = options

  const getViewCapacity = createGetViewCapacity(state, source, itemHeight)

  const getOffset = createGetOffset(source, itemHeight, state)

  const calculateRange = createCalculateRange('vertical', overscan, getOffset, getViewCapacity, resources, updateTrigger)

  const getDistanceTop = createGetDistance(itemHeight, source, state)

  const offsetTop = computed(() => getDistanceTop(state.value.start))

  const totalHeight = createComputedTotalSize(itemHeight, source, state)

  useWatchForSizes(size, list, containerRef, calculateRange)

  const scrollTo = createScrollTo('vertical', calculateRange, getDistanceTop, containerRef)
  const scaleTo = (s: number) => {
    // state.value.scale = s
    const element = containerRef.value
    if (element) {
      const { current } = state.value
      let offsetScroll = 0
      if (typeof itemHeight === 'number') {
        offsetScroll = current * (s * itemHeight - state.value.scale * itemHeight)
      }
      else {
        offsetScroll = source.value.slice(0, current).reduce((sum, _, i) => sum + s * itemHeight(i) - state.value.scale * itemHeight(i), 0)
      }
      element.scrollTop = element.scrollTop + offsetScroll >= 0 ? element.scrollTop + offsetScroll : 0
      state.value.scale = s
    }
  }
  const wrapperProps = computed(() => {
    return {
      style: {
        height: `${totalHeight.value - offsetTop.value}px`,
        marginTop: `${offsetTop.value}px`,
        transform: `translateX(-50%) scale(${state.value.scale})`,
        transformOrigin: '50% 0%'
      }
    }
  })

  return {
    onUpdate,
    state,
    scaleTo,
    calculateRange,
    scrollTo,
    containerStyle,
    wrapperProps,
    currentList,
    containerRef
  }
}
