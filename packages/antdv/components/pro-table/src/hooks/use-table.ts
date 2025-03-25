import { computed, type Ref, unref, onMounted, readonly } from 'vue'
import type {
  TablePropsType,
  PageData,
  BodyCellSlotProps,
  FieldOption,
  TableSlotsType,
  ColumnInside,
  OriginBodyCellProps
} from '../..'
import { handleFn, getAvailableVNode } from '../../utils'

type Params = {
  loading: Ref<boolean>
  pageData: PageData
  formState: Ref<any>
  dataSource: Ref<any[]>
}

export function useTable(props: TablePropsType, slots: TableSlotsType, { loading, pageData, formState, dataSource }: Params) {
  const { columns, request, requestImmediately } = props

  const filteredColumns = computed(() =>
    columns.filter(({ hideInTable }) => !hideInTable)
  )

  const handleRequest = async () => {
    loading.value = true
    const res = await handleFn(
      request,
      readonly({
        pageSize: pageData.pageSize,
        pageNum: pageData.pageNum,
        ...unref(formState)
      })
    )

    if (res && res.success) {
      pageData.total = res.total || 0
      dataSource.value = res.data
    }

    loading.value = false
  }

  onMounted(() => {
    if (requestImmediately) {
      handleRequest()
    }
  })

  const getLabelByValue = (value: string, column: ColumnInside) => {
    if (column.valueType === 'select' || column.valueEnum) {
      const fieldOptions = (column as any)._fieldOptions as FieldOption[]

      return (fieldOptions || []).find(opt => opt.value === value)?.label
    }

    return undefined
  }

  // 判断该 column 是否有 slot 展示
  const hasCurrentColBodySlot = (originScope: OriginBodyCellProps) => {
    if (slots.bodyCell) {
      // eslint-disable-next-line ts/no-use-before-define
      return !!getAvailableVNode(slots.bodyCell(bodyCellProps(originScope)))
        .length
    }

    return false
  }

  const bodyCellProps = (
    originScope: OriginBodyCellProps
  ): BodyCellSlotProps => ({
    ...originScope,
    labelText: getLabelByValue(originScope.text, originScope.column)
  })

  return {
    filteredColumns,
    handleRequest,
    getLabelByValue,
    hasCurrentColBodySlot,
    bodyCellProps
  }
}
