import type { RendererElement } from 'vue'
import type { ExtractProps } from '../src/types'

function hreset(el: RendererElement) {
  el.style.maxHeight = ''
  el.style.overflow = el.dataset.oldOverflow
  el.style.paddingTop = el.dataset.oldPaddingTop
  el.style.paddingBottom = el.dataset.oldPaddingBottom
}
function wreset(el: RendererElement) {
  el.style.maxWidth = ''
  el.style.overflow = el.dataset.oldOverflow
  el.style.paddingLeft = el.dataset.oldPaddingLeft
  el.style.paddingRight = el.dataset.oldPaddingRight
}

const onheight = {
  beforeEnter(el: RendererElement) {
    if (!el.dataset)
      el.dataset = {}

    el.dataset.oldPaddingTop = el.style.paddingTop
    el.dataset.oldPaddingBottom = el.style.paddingBottom
    if (el.style.height) {
      el.dataset.elExistsHeight = el.style.height
    }

    el.style.maxHeight = 0
    el.style.paddingTop = 0
    el.style.paddingBottom = 0
  },

  enter(el: RendererElement) {
    requestAnimationFrame(() => {
      el.dataset.oldOverflow = el.style.overflow
      if (el.dataset.elExistsHeight) {
        el.style.maxHeight = el.dataset.elExistsHeight
      }
      else if (el.scrollHeight !== 0) {
        el.style.maxHeight = `${el.scrollHeight}px`
      }
      else {
        el.style.maxHeight = 0
      }

      el.style.paddingTop = el.dataset.oldPaddingTop
      el.style.paddingBottom = el.dataset.oldPaddingBottom
      el.style.overflow = 'hidden'
    })
  },

  afterEnter(el: RendererElement) {
    el.style.maxHeight = ''
    el.style.overflow = el.dataset.oldOverflow
  },

  enterCancelled(el: RendererElement) {
    hreset(el)
  },

  beforeLeave(el: RendererElement) {
    if (!el.dataset)
      el.dataset = {}
    el.dataset.oldPaddingTop = el.style.paddingTop
    el.dataset.oldPaddingBottom = el.style.paddingBottom
    el.dataset.oldOverflow = el.style.overflow

    el.style.maxHeight = `${el.scrollHeight}px`
    el.style.overflow = 'hidden'
  },

  leave(el: RendererElement) {
    if (el.scrollHeight !== 0) {
      el.style.maxHeight = 0
      el.style.paddingTop = 0
      el.style.paddingBottom = 0
    }
  },

  afterLeave(el: RendererElement) {
    hreset(el)
  },

  leaveCancelled(el: RendererElement) {
    hreset(el)
  }
}
const onwidth = {
  beforeEnter(el: RendererElement) {
    if (!el.dataset)
      el.dataset = {}

    el.dataset.oldPaddingLeft = el.style.paddingLeft
    el.dataset.oldPaddingRight = el.style.paddingRight
    if (el.style.width) {
      el.dataset.elExistsWidth = el.style.width
    }

    el.style.maxWidth = 0
    el.style.paddingLeft = 0
    el.style.paddingRight = 0
  },

  enter(el: RendererElement) {
    requestAnimationFrame(() => {
      el.dataset.oldOverflow = el.style.overflow
      if (el.dataset.elExistsWidth) {
        el.style.maxWidth = el.dataset.elExistsWidth
      }
      else if (el.scrollWidth !== 0) {
        el.style.maxWidth = `${el.scrollWidth}px`
      }
      else {
        el.style.maxWidth = 0
      }

      el.style.paddingLeft = el.dataset.oldPaddingLeft
      el.style.paddingRight = el.dataset.oldPaddingRight
      el.style.overflow = 'hidden'
    })
  },

  afterEnter(el: RendererElement) {
    el.style.maxWidth = ''
    el.style.overflow = el.dataset.oldOverflow
  },

  enterCancelled(el: RendererElement) {
    wreset(el)
  },

  beforeLeave(el: RendererElement) {
    if (!el.dataset)
      el.dataset = {}
    el.dataset.oldPaddingTop = el.style.paddingTop
    el.dataset.oldPaddingRight = el.style.paddingRight
    el.dataset.oldOverflow = el.style.overflow

    el.style.maxWidth = `${el.scrollWidth}px`
    el.style.overflow = 'hidden'
  },

  leave(el: RendererElement) {
    if (el.scrollWidth !== 0) {
      el.style.maxWidth = 0
      el.style.paddingTop = 0
      el.style.paddingRight = 0
    }
  },

  afterLeave(el: RendererElement) {
    wreset(el)
  },

  leaveCancelled(el: RendererElement) {
    wreset(el)
  }
}
export function useCollapseTranstion(props: ExtractProps) {
  return props.mode === 'vertical' ? onheight : onwidth
}
