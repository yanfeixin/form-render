export interface MinioProps {
  baseUrl: string
  token: string
  bucket: string
  business: string
}
export interface InterUploadUrlApi {
  fileId: string
  minioFileReturnEntity: {
    accessKey: string
    endpoint: string
    secretKey: string
    sessionToken: string
  }
  storageType: 'Minio'
}
