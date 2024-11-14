<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang='ts'>
import { Col, Form, Row, Select } from 'ant-design-vue'
import { computed } from 'vue'
import { useNamespace } from '@king-one/antdv/hooks/use-namespace'
import { type AreaOptions, type ArearModelsType, type FieldNames, ProAreaProps, type levelType } from './types'

defineOptions({
  name: 'ProArea'
})
const props = defineProps(ProAreaProps)
Form.useInjectFormItemContext()
const model = defineModel<ArearModelsType['modelValue']>({
  required: true
})
const { b } = useNamespace('pro-area-select')
const placeholder = computed(() => {
  return (index: levelType) => {
    const title = index === 1 ? '请选择省份' : index === 2 ? '请选择城市' : '请选择区县'
    return `请选择${title}`
  }
})

const ops = computed(() => {
  return (index: levelType) => {
    if (props.options.length > 0) {
      return getOps(index)
    }
    return []
  }
})
function getOps(level: levelType) {
  if (level === 1) {
    return props.options.map(item => (
      {
        value: getFieldValue(item, 'id'),
        label: getFieldValue(item, 'name')
      }
    ))
  }
  else if (level === 2) {
    const value = model.value.province
    return value
      ? findChildrenByvalue(props.options, value).map(item => ({
        value: getFieldValue(item, 'id'),
        label: getFieldValue(item, 'name')
      }))
      : []
  }
  else {
    const value = model.value?.city
    return value
      ? findChildrenByvalue(props.options, value).map(item => ({
        value: getFieldValue(item, 'id'),
        label: getFieldValue(item, 'name')
      }))
      : []
  }
}

function findChildrenByvalue(regions: AreaOptions[], value: string) {
  for (const item of regions) {
    if (getFieldValue(item, 'id') === value) {
      return getFieldValue(item, 'children') || []
    }
    if (getFieldValue(item, 'children')) {
      const result = findChildrenByvalue(getFieldValue(item, 'children'), value)
      if (result) {
        return result
      }
    }
  }
  return undefined
}
function getFieldValue(opt?: AreaOptions, key?: keyof FieldNames) {
  return opt && key ? opt[props?.fieldNames[key] || key] : undefined
}
const levels = computed(() => {
  let IDX = props.level
  const arr: string[] = []
  while (IDX--) {
    arr.push(IDX === 2 ? 'province' : IDX === 1 ? 'city' : 'county')
  }
  return arr
})
const c = computed(() => {
  return [b()]
})
</script>

<template>
  <Row :gutter="10">
    <Col v-for="(item, index) in levels" :key="item" :span="24 / level">
      <Select v-model:value="model[item]" :placeholder="placeholder(index + 1 as levelType)" :class="c" :options="ops(index + 1 as levelType)" />
    </Col>
  </Row>
</template>

<style>

</style>
