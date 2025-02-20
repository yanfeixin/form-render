import type { AxiosRequestConfig } from 'axios'

export const proPickerApi = {
  company: (config: AxiosRequestConfig): Promise<any> =>
    globalThis.$http.get(`/security/company/options`, config),
  flowApplication: (config: AxiosRequestConfig): Promise<any> =>
    globalThis.$http.get(`/flow/application/options`, config),
  user: (config: AxiosRequestConfig): Promise<any> =>
    globalThis.$http.get(`/security/user/options`, config),
  getOps: (config: AxiosRequestConfig): Promise<any> =>
    globalThis.$http.get(config.url, config)
}
