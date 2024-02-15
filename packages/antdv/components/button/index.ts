import { withInstall } from '@king-one/utils'
import Button from './src/button.vue'
export * from './src/button'
export const KButton = withInstall(Button) // 增加类型
export default KButton
