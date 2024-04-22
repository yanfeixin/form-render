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
/**
 * 批量下载文件
 * @param data 文件ids
 * @returns
 */
export const batchDwonloadApi = <T>(data: { fileIds: string[] }): Promise<T> =>
  server({
    method: 'post',
    url: '/file/manager/batch/download/url',
    data,
  })
