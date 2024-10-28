import { onBeforeUnmount, onMounted, ref, unref } from 'vue'
import type { MaybeRef } from 'vue'

export function useScrollDetection(refElement: MaybeRef<HTMLElement | null>, incrementwidth: number = 0) {
  const hasHorizontalScroll = ref<boolean>(false)
  const hasVerticalScroll = ref<boolean>(false)

  const checkScrollBar = () => {
    const el = unref(refElement) // 解包ref
    if (el) {
      hasHorizontalScroll.value = el.scrollWidth > el.clientWidth - incrementwidth
      hasVerticalScroll.value = el.scrollHeight > el.clientHeight
    }
  }

  onMounted(() => {
    checkScrollBar() // 初次检查状态

    // 监测元素内容变化
    const mutationObserver = new MutationObserver(checkScrollBar)

    // 监测元素尺寸改变
    const resizeObserver = new ResizeObserver(checkScrollBar)

    const el = unref(refElement)
    if (el) {
      mutationObserver.observe(el, { childList: true, subtree: true, characterData: true })
      resizeObserver.observe(el)
    }

    onBeforeUnmount(() => {
      mutationObserver.disconnect() // 清理变动观察者
      resizeObserver.disconnect() // 清理大小观察者
    })
  })

  return { hasHorizontalScroll, hasVerticalScroll }
}
