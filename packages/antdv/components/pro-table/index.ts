// import ProTable from './src/pro-table.vue';

// export * from './src/pro-table.vue';
// export * from './src/types';
// export * from './hooks/use-pro-table';

// export default ProTable;
import type { App, Plugin } from 'vue'
import { withInstall } from '../utils/install'
import ProTable from './src/pro-table.vue'
import './style'

export * from './src/types'
export * from './hooks/use-pro-table'
export * from './src/pro-table.vue'

export const KProTable = withInstall(ProTable) as typeof ProTable & Plugin

export default KProTable
