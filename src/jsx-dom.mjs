// VDOM -> DOM
export const mountHTML = documentRoot => vdom => mount(documentRoot.childNodes[1], vdom, 0, documentRoot)

const registerEvent = (target, key, value) => target[key] = value

const syncAttr = (target, key) => (value) => {
  switch (typeof value) {
    case "string":
    case "number":
      return target.setAttribute(key, value)
    default:
      return value === true
      ? target.setAttribute(key, "")
      : target.removeAttribute(key)
  }
}

const mountAttrs = (target, props) => {
  // skip syncs for now
  for (const [key, value] of Object.entries(props)) {
    switch (typeof value) {
      case "function": {
        if (key[0] === "o" && key[1] === "n") {
          target[key] = value
          break
        }
      }
    }
  }
}

const mountJSX = (target, { tag, props, children }, indexOffset = 0, parent) => {
  switch (typeof tag) {
    case "string": {
      Object.keys(props).length && mountAttrs(target, props)
      if (children.length) {
        const { childNodes } = target ?? {}
        return (
          children.reduce(
            (indexOffset, child) =>
              mount(childNodes[indexOffset], child, indexOffset, target) + 1,
            0),
          indexOffset
        )
      }
      return indexOffset
    }
    case "function":
      return mount(target, tag({ props, children }), indexOffset, parent)
    case "object":
      if (tag == null) {
        return mount(target, children, indexOffset, parent)
      }
    default: {
      return indexOffset
    }
  }
}

const mount = (target, vdom, indexOffset = 0, parent) => {
  if (Array.isArray(vdom)) {
    const { childNodes } = parent
    return vdom.reduce(
      (indexOffset, vdom, i) => mount(childNodes[indexOffset], vdom, indexOffset, parent) + 1,
      indexOffset
    ) - 1
  }
  switch (vdom) {
    case true:
    case false:
    case null:
    case undefined:
      return indexOffset - 1
  }
  return typeof vdom === "string"
    ? indexOffset
    : mountJSX(target, vdom, indexOffset, parent)
}
