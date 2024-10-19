import { withInstall } from '../utils/install'
import VirtualList from './src/virtual-list.vue'

export * from './src/types'
export const KVirtualList = withInstall(VirtualList)
export default KVirtualList
