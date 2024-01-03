<template>
  <ClientOnly>
    <p text="sm" v-html="decodedDescription" />

    <div class="example">
      <Example :file="pathName" :demo="formatPathDemos[pathName]" />
      <div class="op-btns">
        <Tooltip placement="top" content="复制代码">
          <RiFileCopyLine class="op-btn" @click="copyCode"></RiFileCopyLine>
        </Tooltip>

        <!-- <VIcon class="op-btn" name="icon-fuzhi" @click="copyCode"></VIcon> -->
        <!-- <span class="op-btn" @click="copyCode">复制</span> -->
        <Tooltip placement="top" content="显示源代码">
          <RiCodeLine class="op-btn" @click="toggleSourceVisible"></RiCodeLine>
        </Tooltip>

        <!-- <span class="op-btn" @click="toggleSourceVisible">显示源代码</span> -->
        <!-- <VIcon class="op-btn" name="icon-github"></VIcon>
      <VIcon class="op-btn" name="icon-fuzhi" @click="copyCode"></VIcon>
      <VIcon class="op-btn" name="icon-zitidaima" @click="toggleSourceVisible"></VIcon> -->
      </div>
      <VTransition>
        <SourceCode v-show="sourceVisible" :source="source" />
      </VTransition>
      <Transition name="fade">
        <div v-show="sourceVisible" class="example-float-control" @click="toggleSourceVisible()">
          <!-- <VIcon class="op-btn" name="icon-sanjiao2"></VIcon> -->
          <span>隐藏源代码</span>
        </div>
      </Transition>
    </div>
  </ClientOnly>
</template>
<script setup lang="ts">
import Tooltip from './Tooltip.vue'
import { computed, ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import Example from './v-example.vue'
import SourceCode from './v-source-code.vue'
import VTransition from './v-transition.vue'
import RiFileCopyLine from './icons/RiFileCopyLine.vue'
import RiCodeLine from './icons/RiCodeLine.vue'
// import VIcon from './v-icon.vue';
import message from './message'

const props = defineProps<{
  demos: Object
  source: string
  path: string
  pathName: string
  rawSource: string
  description?: string
}>()

const decodedDescription = computed(() => decodeURIComponent(props.description!))

const formatPathDemos = computed(() => {
  const demos: Object = {}

  Object.keys(props.demos).forEach((key: string) => {
    demos[key.split('./example/')[1].replace('.vue', '')] = props.demos[key].default
  })
  return demos
})

const { copy, isSupported } = useClipboard({
  source: decodeURIComponent(props.rawSource),
})

const copyCode = async () => {
  if (!isSupported) {
    message.error('复制失败')
  }
  try {
    await copy()
    message.info('复制成功')
  } catch (e: any) {
    message.error('复制失败')
  }
}

const sourceVisible = ref<boolean>(false)
const toggleSourceVisible = () => {
  sourceVisible.value = !sourceVisible.value
}

// const formatPathDemos = ref(decodeURIComponent(props.rawSource))
</script>
<style lang="scss">
.example {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  .op-btns {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 2.5rem;
    font-size: 14px;
    border-top: 1px solid var(--vp-c-divider);

    .op-btn {
      margin: 0 0.5rem;
      cursor: pointer;
      color: var(--vp-c-brand);
      transition: 0.2s;
      &:hover {
        color: var(--vp-c-brand);
      }
    }
  }
  &-float-control {
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--vp-c-divider);
    height: 44px;
    box-sizing: border-box;
    // background-color: var(--bg-color, #fff);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    margin-top: -1px;
    color: var(--vp-c-brand-lighter);
    cursor: pointer;
    position: sticky;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    font-size: 14px;
    span {
      margin-left: 10px;
    }

    &:hover {
      color: var(--vp-c-brand);
    }
  }
  .example-float-control {
    color: var(--vp-c-brand);
    background-color: var(--vp-sidebar-bg-color);
  }
}
</style>
