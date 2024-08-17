/* eslint-disable no-undef */
/* eslint-disable prefer-rest-params */
export function deprecate() {
  let once = true
  return function () {
    if (once) {
      console.warn(`DeprecationWarning: ${msg}`)
      once = false
    }
    return fn.apply(this, arguments)
  }
}
