const reactive = new WeakMap
const registerReactive = reactive.set.bind(reactive)
const isReactive = reactive.has.bind(reactive)
const getReactive = reactive.get.bind(reactive)

const apply = fn => fn()

const observable = () => {
  const listeners = new Set
  const notify = value => {
    for (const listener of listeners) {
      console.log({ listener })
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

const state = value => {
  const getter = () => value
  const setter = (newVal) => {
    if (value !== newVal) {
      value = newVal
      notify(value)
    }
  }
  const { notify, subscribe } = observable()
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

const computed = (expr, deps) => {
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
  const { notify, subscribe } = observable()
  registerReactive(getter, subscribe)
  return getter
}

let effectInProgress = false;

const runEffect = (effect, args) => () => {
  const effectCache = effectInProgress
  effectInProgress = true
  effect(...args.map(apply))
  effectInProgress = effectCache
  effectInProgress || cleanupEffects()
}

const effects = []
const cleanupEffects = () => {
  effects.forEach(apply)
  effects.length = 0
}

// const scheduleEffect = effect =>

const effect = (handler, deps) => {
  const effect = runEffect(() => handler(...args))
  const args = initDeps(deps, effects.push(effect))
}
