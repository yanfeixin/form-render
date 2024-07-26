import server from '../utils/reuqest'

export function getUploadUrlApi<T>(params: any): Promise<T> {
  return server({
    method: 'get',
    url: '/file/manager/upload/url',
    params
  })
}
export function getFileInfoApi<T>(data: any): Promise<T> {
  return server({
    method: 'post',
    url: '/file/info',
    data
  })
}
export function removeFileApi<T>(params: any): Promise<T> {
  return server({
    method: 'delete',
    url: '/file/info',
    params
  })
}
/**
 * 批量下载文件
 * @param data 文件ids
 * @returns
 */
export function batchDwonloadApi<T>(data: { fileIds: string[] }): Promise<T> {
  return server({
    method: 'post',
    url: '/file/manager/batch/download/url',
    data
  })
}
