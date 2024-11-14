import { ref } from 'vue'
import { proAreaApis } from '../apis/pro-area.api'

export function useAreaProArea() {
  const ops = ref<any>([])
  proAreaApis.areaTree().then((res) => {
    ops.value = res.data
  })
  return { ops }
}
