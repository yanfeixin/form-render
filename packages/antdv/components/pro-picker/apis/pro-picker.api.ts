import type { AxiosRequestConfig } from 'axios'

export const proPickerApi = {
  company: (config: AxiosRequestConfig): Promise<any> =>
    globalThis.$http.get(`/security/company/options`, config),
  user: (config: AxiosRequestConfig): Promise<any> =>
    globalThis.$http.get(`/security/user/options`, config)
}
