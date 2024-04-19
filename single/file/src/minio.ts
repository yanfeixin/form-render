import type { MinioProps, InterUploadUrlApi } from '../types'
import { Client } from 'minio'
import * as Buffer from 'buffer'

import server from './utils/reuqest'
import { getUploadUrlApi, getFileInfoApi, removeFileApi } from './api/file'
export class MinioClient {
  protected options: MinioProps
  protected routerKye: string = 'minio'
  constructor(props: MinioProps) {
    this.options = props
    const { baseUrl, token } = props
    server.defaults.baseURL = baseUrl
    server.defaults.headers.common['token'] = token
  }
  async upload(file: File): Promise<{ fileId: string; url: string }> {
    try {
      const fileRes = await getUploadUrlApi<InterUploadUrlApi>({ routeKey: this.routerKye })
      const minio = this.getClient(fileRes)
      const { size, name } = file
      const names = name.split('.')
      const fileType = names[names.length - 1]
      const buffer = await this.getBuffer(file)
      await minio.putObject('sign', `${fileRes.fileId}.${fileType}`, buffer, size)
      const fileInfo = {
        originName: `${file.name}`,
        savePath: `sign/${fileRes.fileId}.${fileType}`,
        size: size,
        storeName: `${fileRes.fileId}.${fileType}`,
        type: fileType,
        business: 'chtest', // 项目标识
        id: fileRes.fileId,
        storageType: fileRes.storageType,
      }
      const info = await getFileInfoApi(fileInfo)
      return info as { fileId: string; url: string }
    } catch (error) {
      debugger
      console.log(error)
      return Promise.reject(error)
    }
  }
  async removeFile(id: string) {
    try {
      const res = await removeFileApi({ id })
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  }
  protected getClient(res: InterUploadUrlApi) {
    const { endpoint, accessKey, secretKey, sessionToken } = res.minioFileReturnEntity
    const endPoint = endpoint.split(':')[1].split('//')[1]
    const port = (endpoint.split(':').length > 2 ? Number(endpoint.split(':')[endpoint.split(':').length - 1]) : '') as number
    const useSSL = endpoint.split(':')[0] !== 'http'
    const minio = new Client({
      endPoint,
      port,
      useSSL,
      accessKey,
      secretKey,
      sessionToken,
    })
    return minio
  }
  protected getBuffer(file: File): Promise<Buffer.Buffer> {
    return new Promise((reslove) => {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = async (e: any) => {
        const bf = e.target.result
        var buffer = Buffer.Buffer.from(bf)
        reslove(buffer)
      }
    })
  }
}
