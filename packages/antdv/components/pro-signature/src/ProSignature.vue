<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { ProSignatureProps } from './types'

// const props = withDefaults(defineProps<signatureProps>(), {
//   width: 800,
//   height: 300,
//   lineWidth: 4,
//   lineColor: '#000000',
//   bgColor: '',
//   isCrop: false,
//   isClearBgColor: true,
//   format: 'image/png',
//   quality: 1
// })
const props = defineProps(ProSignatureProps)

const emit = defineEmits(['update:bgColor'])

// refs
const canvas = ref<HTMLCanvasElement | null>(null)
const canvasTxt = ref<CanvasRenderingContext2D | null>(null)
const hasDrew = ref(false)
const resultImg = ref('')
const points = ref<Array<{ x: number, y: number }>>([])
const startX = ref(0)
const startY = ref(0)
const isDrawing = ref(false)
const sratio = ref(1)

// computed
const ratio = computed(() => props.height / props.width)
const myBg = computed(() => (props.bgColor ? props.bgColor : 'rgba(255, 255, 255, 0)'))

// methods
function resizeHandler() {
  if (!canvas.value || !canvasTxt.value)
    return

  const dpr = window.devicePixelRatio || 1
  canvas.value.style.width = `${props.width}px`
  const realw = Number.parseFloat(window.getComputedStyle(canvas.value).width)
  canvas.value.style.height = `${ratio.value * realw}px`

  canvas.value.width = realw * dpr
  canvas.value.height = ratio.value * realw * dpr

  canvasTxt.value.scale(dpr, dpr)
  sratio.value = realw / props.width
}

function drawStart(obj: { x: number, y: number }) {
  if (!canvasTxt.value)
    return

  startX.value = obj.x
  startY.value = obj.y
  canvasTxt.value.beginPath()
  canvasTxt.value.moveTo(startX.value, startY.value)
  canvasTxt.value.lineTo(obj.x, obj.y)
  canvasTxt.value.lineCap = 'round'
  canvasTxt.value.lineJoin = 'round'
  canvasTxt.value.lineWidth = props.lineWidth * sratio.value
  canvasTxt.value.stroke()
  canvasTxt.value.closePath()
  points.value.push(obj)
}

function drawMove(obj: { x: number, y: number }) {
  if (!canvasTxt.value)
    return

  canvasTxt.value.beginPath()
  canvasTxt.value.moveTo(startX.value, startY.value)
  canvasTxt.value.lineTo(obj.x, obj.y)
  canvasTxt.value.strokeStyle = props.lineColor
  canvasTxt.value.lineWidth = props.lineWidth * sratio.value
  canvasTxt.value.lineCap = 'round'
  canvasTxt.value.lineJoin = 'round'
  canvasTxt.value.stroke()
  canvasTxt.value.closePath()
  startY.value = obj.y
  startX.value = obj.x
  points.value.push(obj)
}

function drawEnd(obj: { x: number, y: number }) {
  if (!canvasTxt.value)
    return

  canvasTxt.value.beginPath()
  canvasTxt.value.moveTo(startX.value, startY.value)
  canvasTxt.value.lineTo(obj.x, obj.y)
  canvasTxt.value.lineCap = 'round'
  canvasTxt.value.lineJoin = 'round'
  canvasTxt.value.stroke()
  canvasTxt.value.closePath()
  points.value.push(obj)
  points.value.push({ x: -1, y: -1 })
}

// event handlers
function mouseDown(e: MouseEvent) {
  e.preventDefault()
  isDrawing.value = true
  hasDrew.value = true
  drawStart({
    x: e.offsetX,
    y: e.offsetY
  })
}

function mouseMove(e: MouseEvent) {
  e.preventDefault()
  if (isDrawing.value) {
    drawMove({
      x: e.offsetX,
      y: e.offsetY
    })
  }
}

function mouseUp(e: MouseEvent) {
  e.preventDefault()
  drawEnd({
    x: e.offsetX,
    y: e.offsetY
  })
  isDrawing.value = false
}

function touchStart(e: TouchEvent) {
  hasDrew.value = true
  if (e.touches.length === 1 && canvas.value) {
    const rect = canvas.value.getBoundingClientRect()
    drawStart({
      x: e.targetTouches[0].clientX - rect.left,
      y: e.targetTouches[0].clientY - rect.top
    })
  }
}

function touchMove(e: TouchEvent) {
  e.preventDefault()
  if (e.touches.length === 1 && canvas.value) {
    const rect = canvas.value.getBoundingClientRect()
    drawMove({
      x: e.targetTouches[0].clientX - rect.left,
      y: e.targetTouches[0].clientY - rect.top
    })
  }
}

function touchEnd(e: TouchEvent) {
  e.preventDefault()
  if (e.touches.length === 1 && canvas.value) {
    const rect = canvas.value.getBoundingClientRect()
    drawEnd({
      x: e.targetTouches[0].clientX - rect.left,
      y: e.targetTouches[0].clientY - rect.top
    })
  }
}

function getCropArea(imgData: Uint8ClampedArray) {
  if (!canvas.value)
    return [0, 0, 0, 0]

  let topX = canvas.value.width
  let btmX = 0
  let topY = canvas.value.height
  let btnY = 0

  for (let i = 0; i < canvas.value.width; i++) {
    for (let j = 0; j < canvas.value.height; j++) {
      const pos = (i + canvas.value.width * j) * 4
      if (imgData[pos] > 0 || imgData[pos + 1] > 0 || imgData[pos + 2] || imgData[pos + 3] > 0) {
        btnY = Math.max(j, btnY)
        btmX = Math.max(i, btmX)
        topY = Math.min(j, topY)
        topX = Math.min(i, topX)
      }
    }
  }

  return [topX + 1, topY + 1, btmX + 1, btnY + 1]
}

// public methods
function generate(options?: { format?: string, quality?: number }) {
  return new Promise<string>((resolve, reject) => {
    if (!hasDrew.value || !canvas.value || !canvasTxt.value) {
      reject('Warning: Not Signned!')
      return
    }

    const imgFormat = options?.format || props.format
    const imgQuality = options?.quality || props.quality

    const resImgData = canvasTxt.value.getImageData(0, 0, canvas.value.width, canvas.value.height)
    canvasTxt.value.globalCompositeOperation = 'destination-over'
    canvasTxt.value.fillStyle = myBg.value
    canvasTxt.value.fillRect(0, 0, canvas.value.width, canvas.value.height)

    resultImg.value = canvas.value.toDataURL(imgFormat, imgQuality)
    let finalImg = resultImg.value

    canvasTxt.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
    canvasTxt.value.putImageData(resImgData, 0, 0)
    canvasTxt.value.globalCompositeOperation = 'source-over'

    if (props.isCrop) {
      const cropArea = getCropArea(resImgData.data)
      const cropCanvas = document.createElement('canvas')
      const cropCtx = cropCanvas.getContext('2d')

      if (cropCtx) {
        cropCanvas.width = cropArea[2] - cropArea[0]
        cropCanvas.height = cropArea[3] - cropArea[1]

        const cropImgData = canvasTxt.value.getImageData(cropArea[0], cropArea[1], cropArea[2] - cropArea[0], cropArea[3] - cropArea[1])
        cropCtx.globalCompositeOperation = 'destination-over'
        cropCtx.putImageData(cropImgData, 0, 0)
        cropCtx.fillStyle = myBg.value
        cropCtx.fillRect(0, 0, cropCanvas.width, cropCanvas.height)

        finalImg = cropCanvas.toDataURL(imgFormat, imgQuality)
      }
    }

    resolve(finalImg)
  })
}

function reset() {
  if (!canvas.value || !canvasTxt.value)
    return

  canvasTxt.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  if (props.isClearBgColor) {
    emit('update:bgColor', '')
    canvas.value.style.background = 'rgba(255, 255, 255, 0)'
  }
  points.value = []
  hasDrew.value = false
  resultImg.value = ''
}

// lifecycle
// 添加对 props 宽高的监听
watch(
  () => [props.width, props.height],
  ([newWidth, newHeight]) => {
    if (!canvas.value || !canvasTxt.value)
      return

    canvas.value.width = newWidth
    canvas.value.height = newHeight
    canvas.value.style.background = myBg.value

    // 重新调整尺寸
    resizeHandler()
  }
)

onMounted(() => {
  if (!canvas.value)
    return

  canvas.value.height = props.height
  canvas.value.width = props.width
  canvas.value.style.background = myBg.value
  canvasTxt.value = canvas.value.getContext('2d')

  resizeHandler()
  window.addEventListener('resize', resizeHandler)
  document.addEventListener('mouseup', () => {
    isDrawing.value = false
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
})

const canvasSty = reactive({
  width: `100%`,
  height: '100%'
})
defineExpose({
  generate,
  reset
})
</script>

<template>
  <canvas
    ref="canvas" :style="canvasSty" @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp" @touchstart.passive="touchStart" @touchmove.passive="touchMove" @touchend.prevent="touchEnd"
  />
</template>
