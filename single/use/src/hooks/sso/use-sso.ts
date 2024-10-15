import Cookies from '../../utils/cookie/api'
import { ssoApi } from '../../api'

export function useSSo() {
  const Guard = async (mode: 'history' | 'hash' = 'hash') => {
    const ticket = getParamByKey('ticket', mode)
    if (ticket) {
      const { setToken } = useToken()
      setToken(ticket)
      await ssoApi.checkCenterTicket({ params: { ticket, redirect: window.location.href } })
    }
  }
  const GoUnifiedLogin = async () => {
    const { getToken } = useToken()
    const res = await ssoApi.checkCenterTicket({ params: { ticket: getToken, redirect: window.location.href } })
    return res.data
  }
  return {
    Guard,
    GoUnifiedLogin
  }
//   else {
//     return true
//   }
}
export function useToken() {
  const SSO_CENTER_TICKET = 'sso_center_ticket'

  const getToken = () => Cookies.get(SSO_CENTER_TICKET)

  const setToken = (token: string) => {
    Cookies.set(SSO_CENTER_TICKET, token, { path: '/', expires: 7 })
  }
  const deleteToken = () => {
    Cookies.remove(SSO_CENTER_TICKET, { path: '/' })
  }
  return {
    getToken,
    setToken,
    deleteToken
  }
}
function getParamByKey(key: string, mode: 'history' | 'hash'): string | null {
  if (mode === 'hash') {
    // 哈希模式
    const hash = window.location.hash.substring(1) // 去掉开头的 '#'
    const searchParams = new URLSearchParams(hash)
    return searchParams.get(key)
  }
  else {
    // 历史模式
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.get(key)
  }
}
