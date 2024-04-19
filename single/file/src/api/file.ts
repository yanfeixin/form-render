import server from '../utils/reuqest'

export const getUploadUrlApi = <T>(params: any): Promise<T> =>
  server({
    method: 'get',
    url: '/file/manager/upload/url',
    params,
  })
export const getFileInfoApi = <T>(data: any): Promise<T> =>
  server({
    method: 'post',
    url: '/file/info',
    data,
  })
export const removeFileApi = <T>(params: any): Promise<T> =>
  server({
    method: 'delete',
    url: '/file/info',
    params,
  })
