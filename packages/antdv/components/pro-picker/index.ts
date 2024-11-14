import { withInstall } from '../utils/install'
import ProPicker from './src/ProPicker.vue'

export * from './src/types'
export const KProPicker = withInstall(ProPicker)
export default KProPicker
