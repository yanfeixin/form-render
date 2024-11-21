import { withInstall } from '../utils/install'
import ProModal from './src/Modal'
import './style'

export * from './hooks/useProModal'
export const KProModal = withInstall(ProModal)
export default KProModal
