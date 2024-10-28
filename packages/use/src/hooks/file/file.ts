import type { AxiosRequestConfig } from 'axios'
import { fileApi } from '../../api'

export interface FileData {
  fileId: string
  [x: string]: any
}

export interface batchFileType extends FileData {
  fileImg: string
}

export async function batchDownload(fileList: FileData[]): Promise<batchFileType[]> {
  try {
    const fileIds = fileList.map(item => item.fileId)
    const { data } = await fileApi.batchDownload({ data: fileIds })
    if (Object.keys(data).length > 0) {
      for (const [key, val] of Object.entries(data)) {
        const file = fileList.find(item => item.fileId === key)
        if (file)
          file.imageStr = val
      }
    }
    return fileList as batchFileType[]
  }
  catch (error) {
    return Promise.reject(error)
  }
}
export async function paasBatchDownload<T extends FileData[]>(config: AxiosRequestConfig<T>): Promise<batchFileType[]> {
  try {
    const fileList = config.data || []
    return fileList as batchFileType[]
  }
  catch (error) {
    return Promise.reject(error)
  }
}
