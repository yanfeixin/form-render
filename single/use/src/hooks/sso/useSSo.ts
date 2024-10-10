import Cookies from '../../utils/cookie/api'

export function useSSo() {

}
export function useToken() {
  const SSO_CENTER_TICKET = 'sso_center_ticket'

  const getToken = () => Cookies.get(SSO_CENTER_TICKET)

  const setToken = (token: string) => {
    Cookies.set(SSO_CENTER_TICKET, token, { path: '/' })
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
