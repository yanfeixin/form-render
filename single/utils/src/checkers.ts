/* eslint-disable ts/no-unsafe-function-type */
/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2024-08-26 00:57:17
 * @LastEditors: caohao
 * @LastEditTime: 2024-08-26 00:57:35
 */
const toString = Object.prototype.toString

export const getType = (obj: any) => toString.call(obj)
function isType<T>(type: string | string[]) {
  return (obj: unknown): obj is T =>
    getType(obj) === `[object ${type}]`
}
export const isFn = (val: any): val is Function => typeof val === 'function'
export const isArr = Array.isArray
export const isPlainObj = isType<object>('Object')
export const isStr = isType<string>('String')
export const isBool = isType<boolean>('Boolean')
export const isNum = isType<number>('Number')
export function isMap(val: any): val is Map<any, any> {
  return val && val instanceof Map
}
export const isSet = (val: any): val is Set<any> => val && val instanceof Set
export function isWeakMap(val: any): val is WeakMap<any, any> {
  return val && val instanceof WeakMap
}
export function isWeakSet(val: any): val is WeakSet<any> {
  return val && val instanceof WeakSet
}
export function isNumberLike(index: any): index is number {
  return isNum(index) || /^\d+$/.test(index)
}
export const isObj = (val: unknown): val is object => typeof val === 'object'
export const isRegExp = isType<RegExp>('RegExp')
export function isReactElement(obj: any): boolean {
  return obj && obj.$$typeof && obj._owner
}
export function isHTMLElement(target: any): target is EventTarget {
  return Object.prototype.toString.call(target).includes('HTML')
}

export type Subscriber<S> = (payload: S) => void

export interface Subscription<S> {
  notify?: (payload: S) => void | boolean
  filter?: (payload: S) => any
}
