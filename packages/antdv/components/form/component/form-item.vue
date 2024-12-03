<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { useNamespace } from '@king-one/antdv/hooks/use-namespace'
import { computed, ref, toRaw } from 'vue'
import { type FormItemContext, useProvideFormItem } from '../content/form-content'
import { formItemProps } from './form'

defineOptions({ name: 'KFormItem' })
const props = defineProps(formItemProps)
const { b, e } = useNamespace('form-item')
const c = computed(() => [b()])

const validate: FormItemContext['validate'] = async (trigger: string) => {
  console.log('trigger', trigger)
}

// 验证错误信息
const validateMessage = ref('请输入姓名')
useProvideFormItem({ ...toRaw(props), validate })
</script>

<template>
  <div :class="c">
    <label :class="e('lable')" />
    <div :class="e('content')">
      <slot />
      <div :class="e('error')">
        {{ validateMessage }}
      </div>
    </div>
  </div>
</template>

<style>

</style>
