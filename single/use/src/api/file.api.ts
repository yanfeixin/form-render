import type { AxiosRequestConfig } from 'axios'
import { ApiPrefixEnum } from './prefix'

export const fileUrl = {
  batchDownloadUrl: `${ApiPrefixEnum.FILE}/aio/download/url`
}
export const fileApi = {
  batchDownload: (config: AxiosRequestConfig): any =>
    globalThis.$http.post(`${ApiPrefixEnum.FILE}/aio/download/url`, config.data, config),
  passBatchDownload: (config: AxiosRequestConfig): any =>
    globalThis.$http.post(config.url, config.data, config)
}
