<script setup lang="ts">
import { ref, watch } from 'vue'
import { useNameSpace } from '../hooks/use-namespaces'
import CopySuccess from '../icons/copy-success.vue'

interface MessageNotice {
  content: string
  close: () => void
}

const props = withDefaults(defineProps<MessageNotice>(), {
  content: '复制成功！'
})

const ns = useNameSpace()
const visible = ref(false)
function setVisible(value: boolean) {
  visible.value = value
}
const topHeight = ref(-999)
function setTopHeight(value: number) {
  topHeight.value = value
}

watch(visible, (newValue) => {
  if (newValue === true) {
    setTimeout(() => {
      visible.value = false
    }, 3000)
  }
})

function handleDestroy() {
  props.close()
}

defineExpose({
  setVisible,
  setTopHeight
})
</script>

<template>
  <transition name="slide-fade" @after-leave="handleDestroy">
    <div v-if="visible" :class="[ns.bem('message-notice', 'container')]" :style="{ top: `${topHeight}px` }">
      <CopySuccess />
      <span>{{ content }}</span>
    </div>
  </transition>
</template>

<style src="./message-notice.scss"></style>
