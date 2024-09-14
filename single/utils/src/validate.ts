/* eslint-disable regexp/no-dupe-disjunctions */
export function validatePageRange(str: string) {
  // 正则表达式
  const regex = /^(?:\d+|\d+(?:，\s?\d+)*|\d+(?:,\s?\d+)*|\d{1,2}-\d{1,2})$/
  return regex.test(str)
}
