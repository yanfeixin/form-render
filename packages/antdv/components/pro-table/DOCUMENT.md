# Pro table (简单的文档, 后期完善)

# Props

## Table

- antdTableProps: 除了 columns, dataSource, pagination, loading 以外的所有 antdv 的 props.
- formColNum: 表单列数, 支持的有 1 | 2 | 3 | 4 | 6 | 8 | 12 | 24;
- columns: 列配置.
<!-- - dataSource?: 表格数据（暂时不确定是否有这个属性）. -->
- headerTitle: 表格标题.
- request: 请求表格数据.
- antdFormProps: 除了 model 以外的所有 andv 的props.
- toolbarRender: 自定义工具区域渲染.
- requestImmediately: 是否立刻请求数据, 默认是.
- pageShowTotal: 是否展示分页总个数, 默认是.

## Columns

支持所有 antdv 的 columns props.

- valueType: 值类型.
- valueEnum: 枚举数据.
- hideInTable: 在表格中隐藏该列.
- hideInForm: 在表单中隐藏该列.
- customFormFieldRender: 自定义 formItem 渲染.
- request: 用来请求控件类似下拉等 options 数据.
- initialValue: 表单中的默认值.
- formItemProps: antdv 的 formItem 的 props, 由于引入了这个类型, 如果要使用具有响应性的 columns, 则必须以这种形式声明类型 `const columns: Ref<Column<DataType>[]> = ref([])`, 并且只能使用 `ref`, 或者你也可以使用类型断言, 否则会报类型不匹配, 原因是 ts 类型嵌套过深或无限递归 (这个问题后期看看怎么处理).

## Slots

支持所有 antdv 的 table slots.

- bodyCell: antdv 原有 slot, 对其进行了扩展, 如果 valueType 为 select 的时候, 默认取其对应的 label, 在 slot 的 props 里增加了一个 labelText 字段.
- formField: formField 的 slot, 用来自定义该区域, 如果同时设置了 customFormFieldRender, 则优先级比其高.
- toolbar: 自定义工具区域渲染, 如果同时设置了 toolbarRender, 则优先级比其高.

## Expose

- tableExpose: 查看 TableExpose type.