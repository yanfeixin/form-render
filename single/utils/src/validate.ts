export function validatePageRange(str: string) {
  // 正则表达式
  const regex = /^[1-9]\d*(?:[,，][1-9]\d*)*(?:-[1-9]\d*)?$/
  return regex.test(str)
}
