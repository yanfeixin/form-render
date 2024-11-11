import { withInstall } from '../utils/install'
import scaleVirtualList from './component/scale-virtual-list.vue'

export * from './style/index'
export * from './component/types'
export const KScaleVirtualList = withInstall(scaleVirtualList)
export default KScaleVirtualList
