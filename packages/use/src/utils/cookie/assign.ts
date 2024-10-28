export default function (target, ...args: any[]) {
  const arr = [target, ...args]
  for (let i = 1; i < arr.length; i++) {
    const source = arr[i]
    for (const key in source) {
      target[key] = source[key]
    }
  }
  return target
}
