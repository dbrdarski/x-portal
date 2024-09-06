const reactive = new WeakMap
const registerReactive = reactive.set.bind(reactive)
export const isReactive = reactive.has.bind(reactive)
export const getReactive = reactive.get.bind(reactive)

const apply = fn => fn()

const observable = () => {
  const listeners = new Set
  const notify = value => {
    for (const listener of listeners) {
      console.log({ listener, listeners })
      listener(value)
    }
  }

  const subscribe = listener => {
    listeners.add(listener)
    return () => {
      listeners.remove(listeners)
    }
  }
  return { notify, subscribe }
}

export const state = value => {
  const { notify, subscribe } = observable()
  const getter = () => value
  const setter = (newVal) => {
    if (value !== newVal) {
      value = newVal
      notify(value)
    }
  }
  registerReactive(getter, subscribe)
  return [
    getter,
    setter
  ]
}

const initDeps = (deps, handler) => deps.map(
  dep => isReactive(dep)
    ? (getReactive(dep)(handler), dep)
    : () => dep
)

export const computed = (expr, deps) => {
  const { notify, subscribe } = observable()
  let cache, cached = false
  const invalidate = () => {
    cached = false
    notify()
  }
  const getter = () => {
    if (!cached) {
      cache = expr(...args.map(apply))
      cached = true
    }
    return cache
  }
  const args = initDeps(deps, invalidate)
  registerReactive(getter, subscribe)
  return getter
}

let effectInProgress = false;

const cleanupEffects = () => {
  effects.forEach(apply)
  effects.length = 0
  effectsScheduled = false
}

const wrapEffect = (effect) => () => {
  const effectCache = effectInProgress
  effectInProgress = true
  effect()
  effectInProgress = effectCache
}

const effects = []
let effectsScheduled = false

export const effect = (handler, deps) => {
  let cleanup, scheduled = false

  const effect = wrapEffect(
    () => {
      // cleanup?.() // maybe here
      cleanup = handler(...args.map(apply))
      scheduled = false
    }
  ) // problem: ...args initialization
  const args = initDeps(deps, () => {
    if (!scheduled) {
      cleanup?.() // or here
      scheduled = true
      effects.push(effect)
      effectsScheduled || queueMicrotask(cleanupEffects)
    }
  })
}
