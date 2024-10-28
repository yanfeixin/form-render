<script lang="ts" setup>
import { defaultNamespace } from '@king-one/antdv/hooks/use-namespace'
import { useCollapseTranstion } from '../hooks/use-collapse-transtion'
import { collapseProps } from './types'

defineOptions({
  name: 'CollapseTransition'
})

const props = defineProps(collapseProps)

const on = useCollapseTranstion(props)
</script>

<template>
  <Transition :name="mode === 'horizontal' ? `${defaultNamespace}-horizontal-transition` : `${defaultNamespace}-vertical-transition`" v-on="on">
    <slot />
  </Transition>
</template>
