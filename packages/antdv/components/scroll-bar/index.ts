import { withInstall } from '../utils/install'
import ScrollBar from './src/scroll-bar'
import './style'

export * from './src/types'
export const KScrollBar = withInstall(ScrollBar)
export default KScrollBar
