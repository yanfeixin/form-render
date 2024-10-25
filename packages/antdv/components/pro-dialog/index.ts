import { withInstall } from '../utils/install'
import ProDialog from './src/pro-dialog.vue'
import './style'

export * from './hooks/useProDialog'
export * from './src/types'
export const KProDialog = withInstall(ProDialog)
export default KProDialog
