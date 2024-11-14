import axios from 'axios'

const defaultHeaders = {
  'Content-Type': 'application/json;charset=UTF-8'
}
const http = axios.create({
  baseURL: '/api/',
  timeout: 60000,
  headers: defaultHeaders
})

http.interceptors.request.use(
  (conf) => {
    const headers: Record<string, string> = { ...(conf.headers as any) }
    const token = '6734a4f75f7ebc70a2be9815'

    if (token && !headers.token) {
      headers.token = token
    }

    conf.headers = headers as any

    return conf
  },
  err => Promise.reject(err)
)
http.interceptors.response.use(
  (res) => {
    const { data } = res

    return Promise.resolve(data)
  },
  (err) => {
    return Promise.reject(err)
  }
)
window.$http = http
