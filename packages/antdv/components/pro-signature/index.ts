import { withInstall } from '../utils/install'
import ProSignature from './src/ProSignature.vue'

export * from './src/types'
export const KProSignature = withInstall(ProSignature)
export default KProSignature
