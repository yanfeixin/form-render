export function getImgSize(url: string, zoom: number = 1): Promise<{ width: string, height: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.onload = () => {
      resolve({
        width: (img.width / zoom).toFixed(2),
        height: (img.height / zoom).toFixed(2)
      })
    }
    img.onerror = () => {
      reject(false)
    }
  })
}
// 毫米转px，默认设备的72dpi，即72像素/英寸，A4的尺寸210*297mm,1英寸=2.54厘米，所以图片的大小为：595.33(21/2.54*72)* 841.89(29.7/2.54*72)
export function mmtopx(size: number, dpi: number = 72) {
  return size / 10 / 2.54 * dpi
}
