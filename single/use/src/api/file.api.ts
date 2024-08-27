import type { AxiosRequestConfig } from 'axios'
import { ApiPrefixEnum } from './prefix'

export const fileApi = {
  downloadUrl: (config: AxiosRequestConfig): any =>
    window.$http.post(`${ApiPrefixEnum.FILE}/aio/download/url`, config.data, config)

}
