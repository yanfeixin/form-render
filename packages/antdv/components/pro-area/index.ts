import { withInstall } from '../utils/install'
import ProArea from './src/ProArea.vue'
import './style'

export * from './src/types'
export const KProArea = withInstall(ProArea)
export * from './hooks/use-pro-area'
export default KProArea
