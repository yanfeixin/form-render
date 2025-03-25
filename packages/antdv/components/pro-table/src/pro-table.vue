<script setup lang="ts" generic="RecordType">
import { reactive, ref, toRefs, watch, provide } from 'vue'
import type {
  TablePropsType,
  TableSlotsType,
  AntdSlots,
  PageData,
  TableContextProvideType,
  TableExpose,
  Column,
  ColumnInside,
  OriginBodyCellProps
} from '..'
import { spitRender } from '../utils'
import FormRender from './form-render.vue'
import { TABLE_CONTEXT_PROVIDE_KEY, ANTD_SLOT_NAMES } from './constants'
import { useForm } from './hooks/use-form'
import { useTable } from './hooks/use-table'

const props = withDefaults(defineProps<TablePropsType<RecordType>>(), {
  formColNum: 4,
  requestImmediately: true,
  pageShowTotal: true,
  pageSize: 10
})
// TODO 这里还要对 v-model 的属性单独进行定义

const slots = defineSlots<TableSlotsType<RecordType>>()

const { columns } = props

const formRenderRef = ref<InstanceType<typeof FormRender>>()

const loading = ref(false)
const pageData = reactive<PageData>({
  pageSize: props.pageSize,
  pageNum: 1,
  total: 0
})
const dataSource = ref<any[]>([])

const { formState, genFormState } = useForm(props)

const {
  filteredColumns,
  handleRequest,
  getLabelByValue,
  hasCurrentColBodySlot,
  bodyCellProps
} = useTable(props, slots, {
  loading,
  pageData,
  formState,
  dataSource
})

watch(
  () => columns,
  () => {
    genFormState()
  },
  {
    immediate: true,
    deep: true
  }
)

const context = reactive<TableContextProvideType>({
  ...toRefs(props),
  tableSlots: slots,
  formState,
  loading,
  pageData,
  handleRequest
} as unknown as TableContextProvideType)

provide(
  TABLE_CONTEXT_PROVIDE_KEY,
  context as unknown as TableContextProvideType
)

defineExpose<TableExpose>({
  onRefresh: handleRequest,
  formRef: () => formRenderRef.value?.formRef,
  pageData
})
</script>

<template>
  <!-- eslint-disable vue/component-name-in-template-casing vue/no-use-v-if-with-v-for -->
  <div class="pro-table">
    <ACard
      v-if="!hideForm"
      class="pro-table-form"
      :bordered="false"
      :body-style="{ padding: '16px' }"
      shadow="none!"
    >
      <FormRender ref="formRenderRef" />
    </ACard>
    <ACard
      class="pro-table-table"
      :title="headerTitle"
      :head-style="{
        borderBottom: 'none',
        paddingLeft: '16px',
        paddingRight: '16px',
      }"
      :body-style="{ padding: 0 }"
      :bordered="false"
      shadow="none!"
    >
      <template #extra>
        <div v-if="slots.toolbar || props.toolbarRender" class="toolbar-slot">
          <template v-if="slots.toolbar">
            <slot name="toolbar" />
          </template>
          <template v-else>
            <props.toolbarRender />
          </template>
        </div>
      </template>
      <!-- prettier-ignore-attribute :columns -->
      <ATable
        v-bind="antdTableProps"
        :data-source="dataSource"
        :columns="(filteredColumns as any)"
        :pagination="false"
        :loading="loading"
      >
        <!-- 单独处理 bodyCell slot -->
        <template #bodyCell="scope">
          <template v-if="hasCurrentColBodySlot(scope as OriginBodyCellProps)">
            <slot
              name="bodyCell"
              v-bind="bodyCellProps(scope as OriginBodyCellProps)"
            />
          </template>
          <template v-else-if="scope.column.customRender">
            <spit-render
              :fn="scope.column.customRender"
              :scope="bodyCellProps(scope as OriginBodyCellProps)"
            />
          </template>
          <template
            v-else-if="
              (scope.column as Column).valueType === 'select'
                || (scope.column as Column).valueEnum
            "
          >
            {{ getLabelByValue(scope.text, scope.column as ColumnInside) }}
          </template>
        </template>
        <!-- 其他 slots -->
        <!-- prettier-ignore-attribute v-for -->
        <template
          v-for="(_, name) in (slots as AntdSlots)"
          v-if="name !== 'bodyCell'"
          :key="name"
          #[name]="scope"
        >
          <slot
            v-if="ANTD_SLOT_NAMES.includes(name)"
            :name="name"
            v-bind="scope"
          />
        </template>
      </ATable>
      <div v-if="!hidePage" p="x24px y17px">
        <APagination
          v-model:current="pageData.pageNum"
          v-model:page-size="pageData.pageSize"
          flex
          flex-wrap
          justify-end
          :total="pageData.total"
          size="small"
          show-less-items
          show-size-changer
          :page-size-options="['5', '10', '20', '50', '100']"
          :show-total="pageShowTotal ? (total) => `共 ${total} 条` : undefined"
          @change="handleRequest"
        />
      </div>
    </ACard>
  </div>
</template>

<style lang="scss">
  .pro-table {
    .ant-card {
      .ant-card-head {
        .ant-card-head-wrapper {
          .ant-card-extra {
            margin-inline-start: unset; // 修复无效的windi css类，使用原生CSS
          }
        }
      }
    }

    .ant-table {
      .ant-table-thead {
        tr {
          th {
            @apply bg-[#F7F8FA];

            &::before {
              @apply hidden;
            }
          }
        }
      }

      .ant-table-tbody {
        tr {
          td {
            background-color: transparent !important;
          }
        }
      }
    }
  }
</style>
