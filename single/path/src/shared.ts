/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2024-08-25 14:22:12
 * @LastEditors: caohao
 * @LastEditTime: 2024-08-25 22:10:17
 */
/* eslint-disable no-self-compare */
/* eslint-disable regexp/no-unused-capturing-group */
const toString = Object.prototype.toString
function isType<T>(type: string) {
  return (obj: unknown): obj is T =>
    toString.call(obj) === `[object ${type}]`
}
export const isFn = isType<(...args: any[]) => any>('Function')
export const isArr = Array.isArray || isType<unknown[]>('Array')
export const isPlainObj = isType<object>('Object')
export const isStr = isType<string>('String')
export const isBool = isType<boolean>('Boolean')
export const isNum = isType<number>('Number')
export const isObj = (val: unknown): val is object => typeof val === 'object'
export const isRegExp = isType<RegExp>('RegExp')
export function isNumberLike(t: any) {
  return isNum(t) || /^(\d+)(\.\d+)?$/.test(t)
}
const isArray = isArr
const keyList = Object.keys
const hasProp = Object.prototype.hasOwnProperty

export function toArr<T>(val: T | T[]): T[] {
  return Array.isArray(val) ? val : val !== undefined ? [val] : []
}
export function isAssignable(val: any) {
  return typeof val === 'object' || typeof val === 'function'
}
export function isEqual(a: any, b: any) {
  if (a === b) {
    return true
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const arrA = isArray(a)
    const arrB = isArray(b)
    let i
    let length
    let key

    if (arrA && arrB) {
      length = a.length
      if (length !== b.length) {
        return false
      }
      for (i = length; i-- !== 0;) {
        if (!isEqual(a[i], b[i])) {
          return false
        }
      }
      return true
    }

    if (arrA !== arrB) {
      return false
    }

    const keys = keyList(a)
    length = keys.length

    if (length !== keyList(b).length) {
      return false
    }

    for (i = length; i-- !== 0;) {
      if (!hasProp.call(b, keys[i])) {
        return false
      }
    }
    for (i = length; i-- !== 0;) {
      key = keys[i]
      if (!isEqual(a[key], b[key])) {
        return false
      }
    }

    return true
  }
  return a !== a && b !== b
}
export function isSegmentEqual(a: any, b: any) {
  a = typeof a === 'symbol' ? a : `${a}`
  b = typeof b === 'symbol' ? b : `${b}`
  return a === b
}
