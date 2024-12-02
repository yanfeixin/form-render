import type { AxiosRequestConfig } from 'axios'
import { ApiPrefixEnum } from './prefix'

export const fileUrl = {
  batchDownloadUrl: `${ApiPrefixEnum.FILE}/aio/download/url`
}
export const fileApi = {
  batchDownload: (config: AxiosRequestConfig): any =>
    window.$http.post(`${ApiPrefixEnum.FILE}/aio/download/url`, config.data, config),
    
  fileUpload: (config: AxiosRequestConfig, url):any => window.$http.post(url, config.data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  getFileUrl: (config: AxiosRequestConfig): any =>
  window.$http.get(`${ApiPrefixEnum.FILE}/aio/upload/url`, config),

  getFileDetail: (config: AxiosRequestConfig): any =>
  window.$http.post(`/aio/batch/info`, config.data, config),

  delteFile: (config: AxiosRequestConfig): any =>
  window.$http.delete(`${ApiPrefixEnum.FILE}/aio`, config),
}
