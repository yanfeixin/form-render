import { withInstall } from '@king-one/utils/src/install'
import VirtualList from './component/virtual-list.vue'

export * from './component/types'
export const KVirtualList = withInstall(VirtualList)
export default KVirtualList
