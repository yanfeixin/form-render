/*
 * @Author: caohao
 * @Date: 2023-10-16 14:22:04
 * @LastEditors: caohao
 * @LastEditTime: 2023-12-05 16:42:13
 * @Description:
 */
export const defaultNamespace = 'king'
const _bem = (namespace: string, block: string, blockSuffix: string, element: string, modifier: string) => {
  let cls = `${namespace}-${block}`
  if (blockSuffix) {
    cls += `-${blockSuffix}`
  }
  if (element) {
    cls += `__${element}`
  }
  if (modifier) {
    cls += `--${modifier}`
  }
  return cls
}
export const useNamespace = (block: string) => {
  const b = (blockSuffix = '') => _bem(defaultNamespace, block, blockSuffix, '', '')
  const m = (modifier?: string) => (modifier ? _bem(defaultNamespace, block, '', '', modifier) : '')
  return {
    b,
    m,
  }
}
