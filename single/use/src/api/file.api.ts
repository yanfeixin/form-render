import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { ApiPrefixEnum } from './prefix'

export const fileApi = {
  batchDownload: (config: AxiosRequestConfig): any =>
    globalThis.$http.post(`${ApiPrefixEnum.FILE}/aio/download/url`, config.data, config)
}
