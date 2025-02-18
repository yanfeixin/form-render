<script setup lang='ts'>
import { Button, Card, Space } from 'ant-design-vue'
import { KProSignature } from '@king-one/antdv'
import { ref } from 'vue'

const imgurl = ref('')
const signatureRef = ref<InstanceType<typeof KProSignature> | null>(null)
function handleClear() {
  signatureRef.value?.reset()
}
function handleConfirm() {
  signatureRef.value?.generate().then((base64: string) => {
    imgurl.value = base64
  })
}
</script>

<template>
  <Card>
    <KProSignature ref="signatureRef" :width="600" :height="300" />
    <hr>
    <Space>
      <Button type="primary" block @click="handleConfirm">
        确认
      </Button>
      <Button type="primary" block @click="handleClear">
        清空画布
      </Button>
    </Space>
    <div>
      <img v-if="imgurl" :src="imgurl" width="600" height="300" alt="">
    </div>
  </Card>
</template>

<style>

</style>
