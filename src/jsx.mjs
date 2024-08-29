export const h = (tag, props, ...children) => ({
  tag,
  props: props || {},
  children
})

export const frag = ({ props, children }) => ({
  tag: null,
  props,
  children
})

const escapeAttr = attr => attr && attr.replace(/(?<!\\)"/g, '\\"')

const escapeTextNode = text => text
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const printAttr = ([ key, value ]) => {
  switch (typeof value) {
    case "string":
      return ` ${key}="${escapeAttr(value)}"`
    case "number":
      return ` ${key}="${value}"`
    default:
      return value === true
      ? ` ${key}`
      : ""
  }
}

const printAttrs = props => props
  ? Object.entries(props)
    .map(printAttr)
    .join("")
  : ""

const printJSX = ({ tag, props, children }) => {
  switch (typeof tag) {
    case "string":
      return `<${tag}${printAttrs(props)}>${children.map(print).join("")}</${tag}>`
    case "function":
      // console.log("NodeTree", tag({ props, children })?.children)
      return print(tag({ props, children }))
    case "object":
      if (tag == null) {
        return print(children)
      }
    default: console.log({ tag, props, children })
  }
}

export const print = vdom => {
  if (Array.isArray(vdom))
    return vdom.map(print).join("")
  switch (vdom) {
    case true:
    case false:
    case null:
    case undefined:
      return ""
  }
  return typeof vdom === "string" ? escapeTextNode(vdom) : printJSX(vdom)
}

export const printHTML = vdom => `<!DOCTYPE html>${print(vdom)}`

// VDOM -> DOM
// Need to implement fragment matching for target.childNodes

export const mountHTML = (documentRoot, vdom) => mount(documentRoot.body, vdom.children[1])

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

const mountJSX = (target, { tag, props, children }, indexOffset = 0) => {
  switch (typeof tag) {
    case "string": {
      mountAttrs(target, props)
      const { childNodes } = target
      children.forEach((child, i) => {
        return mount(childNodes[i], child)
      })
    }
    case "function":
      // console.log("NodeTree", tag({ props, children })?.children)
      return mount(target, tag({ props, children }, indexOffset))
    case "object":
      if (tag == null) {
        return mount(target, children, indexOffset)
      }
    default: console.log({ tag, props, children })
  }
}

export const mount = (target, vdom, indexOffset) => {
  if (Array.isArray(vdom)) {
    const { childNodes } = target
    return vdom.forEach((vdom, i) => mount(childNodes[i], vdom, i + indexOffset))
  }
  switch (vdom) {
    case true:
    case false:
    case null:
    case undefined:
      return null
  }
  return typeof vdom === "string" || mountJSX(target, vdom, indexOffset)
}
