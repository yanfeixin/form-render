import { withInstall } from '../utils/install'
import ProModal from './src/ProModal.vue'
import './style'

export * from './hooks/useProModal'
export * from './src/types'
export const KProModal: typeof ProModal = withInstall(ProModal)
export default KProModal
