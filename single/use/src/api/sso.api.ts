import type { AxiosRequestConfig } from 'axios'
import { ApiPrefixEnum } from './prefix'

export const ssoApi = {
  checkCenterTicket: (config: AxiosRequestConfig): Promise<any> =>
    globalThis.$http.get(`${ApiPrefixEnum.SECURITY}/authorize/sso/client/ticket`, config)
}
