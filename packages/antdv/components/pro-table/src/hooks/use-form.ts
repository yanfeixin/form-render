import { ref } from 'vue'
import type { TablePropsType, ValueType } from '../..'

// type Params = {
//   //
// };

export function useForm(props: TablePropsType) {
  const { columns } = props

  const formState = ref<Record<string, any>>({})

  const arrayValueTypes: ValueType[] = ['dateRange']

  const genFormState = () => {
    formState.value = columns.reduce(
      (init, col) => {
        if (col.dataIndex && !col.hideInForm) {
          // TODO 可能是个数组 之后确定 form 的格式等
          const initValue
            = col.valueType && arrayValueTypes.includes(col.valueType) ? [] : ''

          init[col.dataIndex as string]
            = formState.value[col.dataIndex as string]
            || col.initialValue
            || initValue
        }

        return init
      },
      {} as Record<string, any>
    )
  }

  return {
    formState,
    genFormState
  }
}
