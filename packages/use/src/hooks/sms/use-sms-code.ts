// import {signApi} from '@/apis'
import { ref } from 'vue'

type BeforeFn = () => boolean | Promise<boolean>
export function useSmsCode(timeout: number = 30, before?: BeforeFn) {
  const codetext = ref<string>('获取验证码')
  const loading = ref<boolean>(false)
  const sendCode = async (request: () => Promise<any>) => {
    if (loading.value)
      return
    loading.value = true
    if (before) {
      const status = await before()
      if (!status)
        return true
    }
    try {
      await request()
      const time = ref<number>(timeout)
      codetext.value = `${time.value}s`
      const timer = setInterval(() => {
        time.value--
        codetext.value = `${time.value}s`
        if (time.value === -1) {
          clearInterval(timer)
          loading.value = false
          codetext.value = '获取验证码'
        }
      }, 1000)
    }
    catch (error) {
      loading.value = false
    }
  }
  return {
    codetext,
    loading,
    sendCode
  }
}
