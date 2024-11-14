import { withInstall } from '../utils/install'
import ProTitle from './src/ProTitle.vue'
import './style'

export * from './src/types'
export const KProTitle = withInstall(ProTitle)
export default KProTitle
