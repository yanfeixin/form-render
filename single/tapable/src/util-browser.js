export const deprecate = () => {
  let once = true
  return function () {
    if (once) {
      console.warn('DeprecationWarning: ' + msg)
      once = false
    }
    return fn.apply(this, arguments)
  }
}
