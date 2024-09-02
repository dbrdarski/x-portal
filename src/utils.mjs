export const once = fn => {
  let cached = false, cache
  return (...args) => {
    if (!cached) {
      cached = true
      cache = fn(...args)
    }
    return cache
  }
}
