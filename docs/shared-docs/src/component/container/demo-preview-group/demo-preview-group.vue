<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { useNameSpace } from '../../hooks/use-namespaces'
import { computed, ref, onMounted, watch, nextTick } from 'vue'
import CodeOpen from '../../icons/code-open.vue'
import CodeClose from '../../icons/code-close.vue'
// import CodeCopy from '../../icons/code-copy.vue'
import { useCodeFold } from '../../hooks/use-codefold'
interface Props {
  files?: string
}

const { isCodeFold, setCodeFold } = useCodeFold()
const sourceCodeArea = ref<any>(null)
const tabsRef = ref<any>(null)
const codeRef = ref<any>(null)


const sourceCodeContainerHeight = () => {
  let tabsHeight = 0
  if (tabsRef.value) {
    const { height } = tabsRef.value.getBoundingClientRect()
    tabsHeight = height
  }
  let codeHeight = 0
  if (codeRef.value) {
    const { height } = codeRef.value.getBoundingClientRect()
    codeHeight = height
  }
  return tabsHeight + codeHeight
}

function setContainerHeight(value: number) {
  if (isCodeFold.value)
    sourceCodeArea.value.style.height = '0px'
  else sourceCodeArea.value.style.height = `${value}px`
}
onMounted(() => {
  // 组件挂载时，先获取代码块容器为折叠前的容器高度
  const currentContainerHeight = sourceCodeContainerHeight()
  setContainerHeight(currentContainerHeight)
})
watch(isCodeFold, () => {
  const container = sourceCodeContainerHeight()
  setContainerHeight(container)
})


const ns = useNameSpace()
const props = withDefaults(defineProps<Props>(), { files: '() => []' })
const activeFile = ref<string>('')
const parsedFiles = computed(() => {
  try {
    const files = JSON.parse(decodeURIComponent(props.files ?? ''))
    if (!activeFile.value) activeFile.value = files[0]
    return files
  }
  catch {
    return []
  }
})

const handleTab = (file: string) => {
  activeFile.value = file
  nextTick(() => {
    const currentContainerHeight = sourceCodeContainerHeight()
    setContainerHeight(currentContainerHeight)
  })
}
</script>

<template>
  <div :class="[ns.e('preview-group__container')]">
    <section :class="[ns.bem('preview')]" v-if="parsedFiles.length > 0">
      <slot />
    </section>
    <section :class="[ns.bem('description')]">
      <div :class="[ns.bem('description', 'handle-btn')]">
        <CodeClose v-if="!isCodeFold" @click="setCodeFold(true)" />
        <CodeOpen v-else @click="setCodeFold(false)" />
      </div>
    </section>

    <section ref="sourceCodeArea" :class="[ns.bem('source')]">
      <section :class="[ns.bem('tabs')]" ref="tabsRef">
        <div :class="[ns.bem('tabs', 'tab'), activeFile === file && 'is-active']" v-for="file in parsedFiles"
          :key="file" @click="handleTab(file)">{{ file }}</div>
      </section>
      <div ref="codeRef" style="padding-bottom: 5px;">
        <template v-for="file in parsedFiles">
          <slot :name="file" v-if="file === activeFile" />
        </template>
      </div>
    </section>

  </div>
</template>

<style src="./demo-preview-group.scss"></style>