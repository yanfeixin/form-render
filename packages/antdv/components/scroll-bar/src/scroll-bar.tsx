import { computed, defineComponent, onMounted, ref } from 'vue'
import { VResizeObserver } from 'vueuc'
import { off, on } from 'evtd'
import { defaultNamespace } from '@king-one/antdv/hooks/use-namespace'
import { scrollbarProps } from './types'

export default defineComponent({
  name: 'KScrollbar',
  props: scrollbarProps,
  inheritAttrs: false,
  setup(props) {
    onMounted(() => {
      if (props.container)
        return
      sync()
    })
    const handleContentResize = () => {
      sync()
    }
    const handleContainerResize = () => {
      sync()
    }
    const contentRef = ref<HTMLElement | null>(null)
    const containerRef = ref<HTMLElement | null>(null)
    const yRailRef = ref<HTMLElement | null>(null)
    const contentHeightRef = ref<Nullable<number>>(null)
    const contentWidthRef = ref<Nullable<number>>(null)
    const containerHeightRef = ref<Nullable<number>>(null)
    const containerWidthRef = ref<Nullable<number>>(null)
    const yRailSizeRef = ref<Nullable<number>>(null)
    const mergedContentRef = computed(() => props.content?.() || contentRef.value)
    const mergedContainerRef = computed(() => props.container?.() || containerRef.value)
    const containerScrollTopRef = ref(0)
    const yBarSizeRef = computed(() => {
      const { value: containerHeight } = containerHeightRef
      const { value: contentHeight } = contentHeightRef
      const { value: yRailSize } = yRailSizeRef
      if (containerHeight === null || contentHeight === null || yRailSize === null) {
        return 0
      }
      else {
        return Math.min(containerHeight, (yRailSize * containerHeight) / contentHeight + 5 * 1.5)
      }
    })
    const yBarTopRef = computed(() => {
      const { value: containerHeight } = containerHeightRef
      const { value: containerScrollTop } = containerScrollTopRef
      const { value: contentHeight } = contentHeightRef
      const { value: yRailSize } = yRailSizeRef
      if (containerHeight === null || contentHeight === null || yRailSize === null) {
        return 0
      }
      else {
        const heightDiff = contentHeight - containerHeight
        if (!heightDiff)
          return 0
        return (containerScrollTop / heightDiff) * (yRailSize - yBarSizeRef.value)
      }
    })
    const yBarTopPxRef = computed(() => {
      return `${yBarTopRef.value}px`
    })
    const needYBarRef = computed(() => {
      const { value: containerHeight } = containerHeightRef
      const { value: contentHeight } = contentHeightRef
      return containerHeight !== null && contentHeight !== null && contentHeight > containerHeight
    })

    const yBarSizePxRef = computed(() => {
      return `${yBarSizeRef.value}px`
    })
    const syncPositionState = () => {
      const { value: content } = mergedContentRef
      if (content) {
        contentHeightRef.value = content.offsetHeight
        contentWidthRef.value = content.offsetWidth
      }
      const { value: container } = mergedContainerRef
      if (container) {
        containerHeightRef.value = container.offsetHeight
        containerWidthRef.value = container.offsetWidth
      }
      const { value: yRailEl } = yRailRef
      if (yRailEl) {
        yRailSizeRef.value = yRailEl.offsetHeight
      }
    }
    let yBarPressed = false
    let memoYTop: number = 0
    let memoMouseY: number = 0
    let yBarVanishTimerId: number | undefined

    const handleYScrollMouseMove = (e: MouseEvent) => {
      if (!yBarPressed)
        return

      if (yBarVanishTimerId !== undefined) {
        window.clearTimeout(yBarVanishTimerId)
      }
      const { value: containerHeight } = containerHeightRef
      const { value: contentHeight } = contentHeightRef
      const { value: yBarSize } = yBarSizeRef
      if (containerHeight === null || contentHeight === null)
        return
      const dY = e.clientY - memoMouseY
      const dScrollTop = (dY * (contentHeight - containerHeight)) / (containerHeight - yBarSize)
      const toScrollTopUpperBound = contentHeight - containerHeight
      let toScrollTop = memoYTop + dScrollTop
      toScrollTop = Math.min(toScrollTopUpperBound, toScrollTop)
      toScrollTop = Math.max(toScrollTop, 0)
      const { value: container } = mergedContainerRef
      if (container) {
        container.scrollTop = toScrollTop
      }
    }
    const handleYScrollMouseUp = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      off('mousemove', window, handleYScrollMouseMove, true)
      off('mouseup', window, handleYScrollMouseUp, true)
      yBarPressed = false
      sync()
    }
    const handleYScrollMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      on('mousemove', window, handleYScrollMouseMove, true)
      on('mouseup', window, handleYScrollMouseUp, true)
      memoYTop = containerScrollTopRef.value
      memoMouseY = e.clientY
      yBarPressed = true
    }
    function handleScroll(e: Event): void {
      const { onScroll } = props
      if (onScroll)
        onScroll(e)
      syncScrollState()
    }
    function syncScrollState(): void {
      // only collect scroll state, do not trigger any dom event
      const { value: container } = mergedContainerRef
      if (container) {
        containerScrollTopRef.value = container.scrollTop
      }
    }
    function sync(): void {
      syncPositionState()
      syncScrollState()
    }

    return {
      sync,
      handleContentResize,
      handleContainerResize,
      contentRef,
      yRailRef,
      containerRef,
      contentHeightRef,
      containerHeightRef,
      needYBarRef,
      yBarSizePxRef,
      handleYScrollMouseDown,
      yBarTopPxRef,
      handleScroll
    }
  },
  render() {
    const { $slots } = this
    const createYBar = () => {
      return (
        <div class={`${defaultNamespace}-scrollbar-rail`} ref="yRailRef">
          {this.needYBarRef && (
            <div
              class={`${defaultNamespace}-scrollbar-rail__scrollbar`}
              style={{
                height: this.yBarSizePxRef,
                top: this.yBarTopPxRef
              }}
              onMousedown={this.handleYScrollMouseDown}
            >
            </div>
          )}
        </div>
      )
    }

    const createChildren = () => {
      return (
        <div class={`${defaultNamespace}-scrollbar`} {...this.$attrs}>
          {this.container
            ? (
                $slots.default?.()
              )
            : (
                <div class={`${defaultNamespace}-scrollbar-container`} onScroll={this.handleScroll} ref="containerRef">
                  <VResizeObserver onResize={this.handleContentResize}>
                    <div ref="contentRef" class={`${defaultNamespace}-scrollbar-content`}>
                      {$slots.default?.()}
                    </div>
                  </VResizeObserver>
                </div>
              )}

          {createYBar()}
        </div>
      )
    }
    const createBarNode = this.container ? createChildren() : <VResizeObserver onResize={this.handleContainerResize}>{createChildren()}</VResizeObserver>
    return createBarNode
  }
})
