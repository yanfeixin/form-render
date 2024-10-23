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
    const xRailRef = ref<HTMLElement | null>(null)
    const contentHeightRef = ref<Nullable<number>>(null)
    const contentWidthRef = ref<Nullable<number>>(null)
    const containerHeightRef = ref<Nullable<number>>(null)
    const containerWidthRef = ref<Nullable<number>>(null)
    const yRailSizeRef = ref<Nullable<number>>(null)
    const xRailSizeRef = ref<Nullable<number>>(null)
    const mergedContentRef = computed(() => props.content?.() || contentRef.value)
    const mergedContainerRef = computed(() => props.container?.() || containerRef.value)
    const containerScrollTopRef = ref(0)
    const containerScrollLeftRef = ref(0)

    /**   竖向滚动条相关逻辑 */
    const needYBarRef = computed(() => {
      const { value: containerHeight } = containerHeightRef
      const { value: contentHeight } = contentHeightRef
      return containerHeight !== null && contentHeight !== null && contentHeight > containerHeight
    })
    /** 竖向滚动条的大小（高度） */
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

    const yBarSizePxRef = computed(() => {
      return `${yBarSizeRef.value}px`
    })
    /** 竖向滚动条的top */
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

    /** 竖向滚动条的拖拽 */
    let yBarPressed = false
    let memoYTop: number = 0
    let memoMouseY: number = 0
    let yBarVanishTimerId: number | undefined
    let xBarVanishTimerId: number | undefined
    const handleYScrollMouseMove = (e: MouseEvent) => {
      if (!yBarPressed)
        return

      if (xBarVanishTimerId !== undefined) {
        window.clearTimeout(xBarVanishTimerId)
      }
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
    /** =======================================华丽的分割线==================================== */

    const needXBarRef = computed(() => {
      const { value: containerWidth } = containerWidthRef
      const { value: contentWidth } = contentWidthRef
      return containerWidth !== null && contentWidth !== null && contentWidth > containerWidth
    })
    // 横向滚动条的大小（width）
    const xBarSizeRef = computed(() => {
      const { value: containerWidth } = containerWidthRef
      const { value: contentWidth } = contentWidthRef
      const { value: xRailSize } = xRailSizeRef
      if (containerWidth === null || contentWidth === null || xRailSize === null) {
        return 0
      }
      else {
        return (xRailSize * containerWidth) / contentWidth + 5 * 1.5
      }
    })
    const xBarSizePxRef = computed(() => {
      return `${xBarSizeRef.value}px`
    })
    // 横向滚动条的Left
    const xBarLeftRef = computed(() => {
      const { value: containerWidth } = containerWidthRef
      const { value: containerScrollLeft } = containerScrollLeftRef
      const { value: contentWidth } = contentWidthRef
      const { value: xRailSize } = xRailSizeRef
      if (containerWidth === null || contentWidth === null || xRailSize === null) {
        return 0
      }
      else {
        const widthDiff = contentWidth - containerWidth
        if (!widthDiff)
          return 0
        return (containerScrollLeft / widthDiff) * (xRailSize - xBarSizeRef.value)
      }
    })
    const xBarLeftPxRef = computed(() => {
      return `${xBarLeftRef.value}px`
    })
    /** 竖向滚动条的拖拽 */
    let xBarPressed = false
    let memoXLeft: number = 0
    let memoMouseX: number = 0
    const handleXScrollMouseMove = (e: MouseEvent) => {
      if (!xBarPressed)
        return
      if (xBarVanishTimerId !== undefined) {
        window.clearTimeout(xBarVanishTimerId)
      }
      if (yBarVanishTimerId !== undefined) {
        window.clearTimeout(yBarVanishTimerId)
      }
      const { value: containerWidth } = containerWidthRef
      const { value: contentWidth } = contentWidthRef
      const { value: xBarSize } = xBarSizeRef
      if (containerWidth === null || contentWidth === null)
        return
      const dX = e.clientX - memoMouseX

      const dScrollLeft = (dX * (contentWidth - containerWidth)) / (containerWidth - xBarSize)
      const toScrollLeftUpperBound = contentWidth - containerWidth
      let toScrollLeft = memoXLeft + dScrollLeft
      toScrollLeft = Math.min(toScrollLeftUpperBound, toScrollLeft)
      toScrollLeft = Math.max(toScrollLeft, 0)
      const { value: container } = mergedContainerRef
      if (container) {
        container.scrollLeft = toScrollLeft
      }
    }
    const handleXScrollMouseUp = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      off('mousemove', window, handleXScrollMouseMove, true)
      off('mouseup', window, handleXScrollMouseUp, true)
      xBarPressed = false
      sync()
    }
    function handleXScrollMouseDown(e: MouseEvent): void {
      e.preventDefault()
      e.stopPropagation()
      xBarPressed = true
      on('mousemove', window, handleXScrollMouseMove, true)
      on('mouseup', window, handleXScrollMouseUp, true)
      memoXLeft = containerScrollLeftRef.value
      memoMouseX = e.clientX
    }

    /** */
    function syncScrollState(): void {
      // only collect scroll state, do not trigger any dom event
      const { value: container } = mergedContainerRef
      if (container) {
        containerScrollTopRef.value = container.scrollTop
        containerScrollLeftRef.value = container.scrollLeft
      }
    }
    const syncPositionState = () => {
      const { value: content } = mergedContentRef
      if (content) {
        const contentClient = content.getBoundingClientRect()
        contentHeightRef.value = contentClient.height
        contentWidthRef.value = contentClient.width
      }
      const { value: container } = mergedContainerRef
      if (container) {
        const containerClient = container.getBoundingClientRect()
        containerHeightRef.value = containerClient.height
        containerWidthRef.value = containerClient.width
      }
      const { value: yRailEl } = yRailRef
      if (yRailEl) {
        yRailSizeRef.value = yRailEl.offsetHeight
      }
      const { value: xRailEl } = xRailRef
      if (xRailEl) {
        xRailSizeRef.value = xRailEl.offsetWidth
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
      xRailRef,
      containerRef,
      contentHeightRef,
      containerHeightRef,
      needYBarRef,
      needXBarRef,
      yBarSizePxRef,
      handleYScrollMouseDown,
      handleXScrollMouseDown,
      yBarTopPxRef,
      handleScroll,
      xBarSizePxRef,
      xBarLeftPxRef
    }
  },
  render() {
    const { $slots, xScrollable } = this
    const createXBar = () => {
      return (
        <div class={`${defaultNamespace}-scrollbar-rail ${defaultNamespace}-scrollbar-rail--horizontal`} ref="xRailRef">
          {this.needXBarRef && (
            <div
              class={`${defaultNamespace}-scrollbar-rail__scrollbar--horizontal`}
              style={{
                width: this.xBarSizePxRef,
                left: this.xBarLeftPxRef
              }}
              onMousedown={this.handleXScrollMouseDown}
            >
            </div>
          )}
        </div>
      )
    }
    const createYBar = () => {
      return (
        <div class={`${defaultNamespace}-scrollbar-rail ${defaultNamespace}-scrollbar-rail--vertical`} ref="yRailRef">
          {this.needYBarRef && (
            <div
              class={`${defaultNamespace}-scrollbar-rail__scrollbar--vertical`}
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
          {xScrollable && createXBar()}
        </div>
      )
    }
    const createBarNode = this.container ? createChildren() : <VResizeObserver onResize={this.handleContainerResize}>{createChildren()}</VResizeObserver>
    return createBarNode
  }
})
