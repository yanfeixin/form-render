import type { AxiosRequestConfig } from 'axios'

export const reportApi = {
  errorReport: (config: AxiosRequestConfig): any =>
    globalThis.$http.post(`/runtime/aio/error/reported`, config.data, config)
}
