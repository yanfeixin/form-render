import type {
  Table,
  TableProps,
  TableColumnType,
  FormProps,
  FormItemProps,
  InputProps,
  RadioProps,
  SelectProps,
  DatePickerProps,
  FormInstance,
  ColProps
} from 'ant-design-vue'
import { type RangePickerProps } from 'ant-design-vue/es/date-picker'
import type { RenderedCell } from 'ant-design-vue/es/vc-table/interface'
import { type Slot, type Ref } from 'vue'

export type BasicValue = string | number | boolean | undefined

export type PickParameter<
  T extends Record<any, any>,
  K extends keyof T
> = Parameters<Required<T>[K]>

export type RewriteParameters<
  T extends Record<any, any>,
  K extends keyof T,
  Item
> = Omit<PickParameter<T, K>[number], keyof Item> & Item

// Value type
/**
 * 几种情况
 * 1. 默认为 text
 * 2. 为 option 不展示表单
 * 3. column 里没有 valueType, 但是有 valueEnum 则默认为 select
 */
export type ValueType = 'text' | 'select' | 'radio' | 'option' | 'dateRange'
export type ValueEnumStatue =
  | 'Success'
  | 'Error'
  | 'Processing'
  | 'Warning'
  | 'Default'
export type ValueEnumValue = {
  text: string
  status?: ValueEnumStatue
  disabled?: boolean
}
export type ValueEnum = {
  [key: string]: ValueEnumValue
}

// Form item
export type FormFieldSlotProps<RecordType = any> = {
  column: ColumnInside<RecordType>
  value: any
  formState: Record<string, any>
}

// Field
export type FieldOption = Omit<
  Partial<ValueEnumValue> & { value: string, label: string },
  'status'
>
export type OmitProperties<T, P extends string = 'model'> = Omit<T, P>
export type FieldProps =
  | OmitProperties<InputProps>
  | OmitProperties<SelectProps>
  | OmitProperties<RadioProps, 'checked'>
  | OmitProperties<DatePickerProps>
  | OmitProperties<RangePickerProps>

// Table column
export type ExtraColumnType<RecordType = any> = {
  /** 值类型 也代表着字段控件的类型 */
  valueType?: ValueType
  /** select 等可枚举或下拉的控件的枚举值 */
  valueEnum?: ValueEnum // 暂时不知道 valueEnum 有什么好的使用场景
  /** 在表格中隐藏该列 */
  hideInTable?: boolean
  /** 在表单中隐藏该列 */
  hideInForm?: boolean
  /** 用来请求控件类似下拉等 options 数据 */
  request?: ColumnRequest
  /** 字段控件的 props */
  fieldProps?: FieldProps
  /** 初始化的值 */
  initialValue?: any
  /** antdv 的 formItem 的 props */
  formItemProps?: FormItemProps
  /** 字段布局 同 <Col> 组件 默认 span 为根据 table props 中的 formColNum 计算而来 */
  fieldCol?: ColProps
  /** form 中的每一个字段的自定义渲染函数 */
  customFormFieldRender?: (props: FormFieldSlotProps<RecordType>) => any
  /** 表格中的 body 下的每个 cell 的自定义渲染函数, 同 antdv */
  customRender?: (
    opt: CustomRenderProps<RecordType>
  ) => any | RenderedCell<RecordType>
}
export type CustomRenderProps<RecordType = any> = BodyCellSlotProps<RecordType>
export type OmittedAntdTableColumnProps = 'customRender'
export type TableColumnProps<RecordType = any> = Omit<
  TableColumnType<RecordType>,
  OmittedAntdTableColumnProps
>
export type Column<RecordType = any> = TableColumnProps<RecordType> &
  ExtraColumnType<RecordType>
// 组件内部使用的 column 类型, 不提供给用户智能提示, Column 类型是给用户智能提示的.
export type ColumnInside<RecordType = any> = Column<RecordType> & {
  _fieldOptions?: Readonly<FieldOption[]>
}

// Antd table props
export type OmittedAntdTableProps =
  | 'columns'
  | 'dataSource'
  | 'pagination'
  | 'loading'
export type AntdTableProps = Omit<TableProps, OmittedAntdTableProps>

// Table props
export type TablePropsType<RecordType = any> = {
  /** antdv 的 table 属性 */
  antdTableProps?: AntdTableProps
  /** 表单每行展示几列 */
  formColNum?: 1 | 2 | 3 | 4 | 6 | 8 | 12 | 24
  /** Table column 配置 */
  columns: Column<RecordType>[]
  /** 是否隐藏头部标题 */
  headerTitle?: string
  /** 数据请求方法 */
  request?: TableRequest
  /** antdv 的 form 属性 */
  antdFormProps?: Omit<FormProps, 'model'>
  /** 工具条自定义渲染函数 */
  toolbarRender?: () => void
  /** 是否立即执行一次 request 中的方法 */
  requestImmediately?: boolean
  /** 页码中是否展示总数 */
  pageShowTotal?: boolean
  /** 页码中的每页展示数量 */
  pageSize?: number
  /** 是否隐藏表单 */
  hideForm?: boolean
  /** 是否隐藏页码 */
  hidePage?: boolean
  /** 按钮布局 同 <Col> 组件 默认 span 为根据 table props 中的 formColNum 计算而来 */
  buttonCol?: ColProps
}

// Providers
export type TableContextProvideType = TablePropsType & {
  column: ColumnInside
} & {
  tableSlots: TableSlotsType
  formState: Record<string, any>
  loading: Ref<boolean>
  pageData: PageData
  handleRequest: () => void
}
export type FieldContextProvideType = {
  fieldOptions: Ref<FieldOption[]>
  column: Column
}

// Table request and form options request
export type TableRequestParams = {
  readonly pageSize: number
  readonly pageNum: number
  readonly [key: string]: any
}
export type TableRequestReturn = {
  data: any
  success: boolean
  total?: number
}
export type RequestFn<Params = any, Return = any> = (
  params: Params
) => Return | Promise<Return>
export type TableRequest = RequestFn<TableRequestParams, TableRequestReturn>
export type ColumnRequest = RequestFn<any, FieldOption[]>

// Table slots
export type OriginBodyCellProps = PickParameter<
  AntdSlots,
  'bodyCell'
>[number] & {
  column: ColumnInside
}
export type OmittedAntdTableSlots = 'bodyCell' | 'headerCell'
export type BodyCellSlotProps<RecordType = any> = RewriteParameters<
  AntdSlots,
  'bodyCell',
  {
    record: RecordType
    column: ColumnInside<RecordType>
    labelText?: string
  }
>
export type HeaderCellSlotProps<RecordType = any> = RewriteParameters<
  AntdSlots,
  'headerCell',
  {
    column: ColumnInside<RecordType>
  }
>
export type ExtraTableSlotsType<RecordType = any> = {
  /** form 中的每一个字段的插槽 */
  formField?: Slot<FormFieldSlotProps<RecordType>>
  /** 表格中的 body 下的每个 cell 插槽, 同 antdv */
  bodyCell?: Slot<BodyCellSlotProps<RecordType>>
  /** 表格中的 header 下的每个 cell 插槽, 同 antdv */
  headerCell?: Slot<HeaderCellSlotProps<RecordType>>
  /** 工具条插槽 */
  toolbar?: Slot
}
export type AntdSlots = InstanceType<typeof Table>['$slots']
export type TableSlotsType<RecordType = any> = Omit<
  AntdSlots,
  OmittedAntdTableSlots
> &
ExtraTableSlotsType<RecordType>

// Page
export type PageData = {
  pageNum: number
  pageSize: number
  total: number
}

// Expose
export type TableExpose = {
  /** 刷新数据 */
  onRefresh: () => void
  /** 表单的 context ref */
  formRef: () => FormInstance | undefined
  /** 页码信息 */
  pageData: PageData
}
