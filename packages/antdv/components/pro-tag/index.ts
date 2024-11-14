import { withInstall } from '../utils/install'
import ProTag from './src/ProTag.vue'

export * from './src/types'
export const KProTag = withInstall(ProTag)
export default KProTag
