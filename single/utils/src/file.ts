// Base64 数据转换为 File 对象 const file = base64ToFile(base64Data, 'image.png');
export function base64ToFile(base64: string, filename: string): File {
  // 去掉 Base64 字符串的头部信息
  const arr = base64.split(',')
  const mime = arr[0]?.match(/:(.*?);/)?.[1]
  const bstr = atob(arr[1]) // 解码 Base64
  const n = bstr.length
  const u8arr = new Uint8Array(n)

  // 将每个字节填充到 Uint8Array 中
  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i)
  }

  // 创建 File 对象
  return new File([u8arr], filename, { type: mime })
}
