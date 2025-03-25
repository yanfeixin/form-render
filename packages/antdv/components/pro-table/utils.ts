import type { VNode } from 'vue'

export function spitRender(data: { fn: (...args: any) => any, scope: any }) {
  const { fn, scope } = data

  return fn(scope)
}

export function handleFn<T extends (...args: any) => any>(fn: T | undefined | null, ...args: Parameters<T>) {
  return (typeof fn === 'function'
    ? fn(...(args as any))
    : undefined) as ReturnType<T>
}

export function getAvailableVNode(vNodes: VNode[]) {
  return vNodes.filter(node => node.type !== Comment)
}
