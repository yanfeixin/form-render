import type { InjectionKey } from 'vue'
import type {
  TableContextProvideType,
  TableSlotsType,
  FieldContextProvideType
} from '..'

// Provide and inject keys
export const TABLE_CONTEXT_PROVIDE_KEY = Symbol(
  'PRO_TABLE_CONTEXT_PROVIDE_KEY'
) as InjectionKey<TableContextProvideType>
export const FIELD_CONTEXT_PROVIDE_KEY = Symbol(
  'PRO_FIELD_CONTEXT_PROVIDE_KEY'
) as InjectionKey<FieldContextProvideType>

export const ANTD_SLOT_NAMES: (keyof TableSlotsType)[] = [
  'bodyCell',
  'customFilterDropdown',
  'customFilterIcon',
  'default',
  'emptyText',
  'expandColumnTitle',
  'expandIcon',
  'expandedRowRender',
  'footer',
  'headerCell',
  'summary',
  'title'
]
