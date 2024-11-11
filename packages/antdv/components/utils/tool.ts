export function rafThrottle(fn: (...arg: any[]) => any) {
  let lock = false
  return function (this: any, ...args: any[]) {
    if (lock)
      return
    lock = true
    window.requestAnimationFrame(() => {
      fn.apply(this, args)
      lock = false
    })
  }
}
