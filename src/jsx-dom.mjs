import { isReactive, effect } from "./reactive.mjs"

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
        if (isReactive(value)) {
          effect((value) => {target.setAttribute(key, value)}, [value])
        } else if (key[0] === "o" && key[1] === "n") {
          target[key] = value
          break
        }
      }
    }
  }
}

const mountJSX = (target, vdom, indexOffset = 0, parent, parentContext) => {
  const { tag, props, children } = vdom
  const context = vdom.context = {
    vdom,
    parent,
    target,
    prev: null,
    next: null,
    prevTarget: null,
    nextTarget: null,
  }
  switch (typeof tag) {
    case "string": {
      Object.keys(props).length && mountAttrs(target, props)
      if (children.length) {
        const { childNodes } = target ?? {}
        return (
          children.reduce(
            (indexOffset, child) =>
              mount(childNodes[indexOffset], child, indexOffset, target, context) + 1,
            0),
          indexOffset
        )
      }
      return indexOffset
    }
    case "function":
      return mount(target, tag({ props, children }), indexOffset, parent, context)
    case "object":
      if (tag == null) {
        return mount(target, children, indexOffset, parent, context)
      }
    default: {
      return indexOffset
    }
  }
}

const mount = (target, vdom, indexOffset = 0, parent, parentContext) => {
  if (Array.isArray(vdom)) {
    const { childNodes } = parent
    return vdom.reduce(
      (indexOffset, vdom, i) => mount(childNodes[indexOffset], vdom, indexOffset, parent, parentContext) + 1,
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

  switch (typeof vdom) {
    case "string":
    case "number":
      // TODO: handle multimple text nodes, for example: asdf {someVar} bsd
      return indexOffset
      // TODO: add syncJSX => isReactive -> effect(syncJSX)
    default: return mountJSX(target, vdom, indexOffset, parent, parentContext)
  }
  // return typeof vdom === "string"
  //   ? indexOffset
  //   : mountJSX(target, vdom, indexOffset, parent)
}



// Next Big TODOs:
// ===============
// Figure out text node one to meny mounting
// add the context to VDOM trees (double linked lists)
