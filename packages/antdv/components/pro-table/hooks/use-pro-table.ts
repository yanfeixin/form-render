import { ref } from 'vue'
import { type TableExpose } from '../src/types'

export function useProTable() {
  const proTableRef = ref<TableExpose>()
  const onRefresh = () => {
    proTableRef.value?.onRefresh()
  }
  return { proTableRef, onRefresh }
}
