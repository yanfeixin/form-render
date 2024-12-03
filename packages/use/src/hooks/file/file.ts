import type { AxiosRequestConfig } from 'axios'
import { fileApi } from '../../api'

export interface FileData {
  fileId: string
  [x: string]: any
}

export interface UploadFileData extends FileData {
  url: string
  originName: string
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

export async function uploadFile(data: FormData, business = 'test'): Promise<UploadFileData> {
  try {
    const fileUrlRes = await fileApi.getFileUrl({ params: { business } })
    const fileRes = await fileApi.fileUpload({ data }, fileUrlRes.data)
    const detailRes = await batchDownload([{ fileId: fileRes.data.id }])

    const url = detailRes[0].imageStr

    return { ...fileRes.data, url, fileId: fileRes.data.id } as UploadFileData
  }
  catch (error) {
    return Promise.reject(error)
  }
}

export async function removeFile(fileId: string): Promise<void> {
  try {
    const res = await fileApi.delteFile({ params: { fileId } })
    return res
  }
  catch (error) {
    return Promise.reject(error)
  }
}
