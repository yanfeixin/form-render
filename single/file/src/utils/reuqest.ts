import axios, { type AxiosResponse } from 'axios'

const server = axios.create({
  timeout: 1000 * 60
})
interface InterRes {
  status: number
  data: any
}
server.interceptors.response.use(
  (res: AxiosResponse<InterRes, any>) => {
    const { status } = res.data
    if (status === 0 || status === 200) {
      return res.data.data
    }
    return Promise.reject(res.data)
  },
  (error) => {
    return Promise.reject(error)
  }
)
export default server
