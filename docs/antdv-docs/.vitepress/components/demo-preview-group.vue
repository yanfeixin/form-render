<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { computed } from 'vue'

interface Props {
  files?: string
}

const props = withDefaults(defineProps<Props>(), { files: '() => []' })
const parsedFiles = computed(() => {
  try {
    const files = JSON.parse(decodeURIComponent(props.files ?? ''))
    console.log('parsedFiles', files)
    return files
  }
  catch {
    return []
  }
})
</script>

<template>
  <div class="asd">
    <slot v-if="parsedFiles.length > 0" />
    <div v-if="parsedFiles.length > 0" :files="parsedFiles">
      <template v-for="file in parsedFiles">
        <slot :name="file" />
      </template>
    </div>
  </div>
</template>

<style>

</style>
