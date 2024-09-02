const escapeAttr = attr => attr && attr.replace(/(?<!\\)"/g, '\\"')

const escapeTextNode = text => text
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const voidElements = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
]);

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
      return `<${tag}${printAttrs(props)}${(!voidElements.has(tag)) ? `>${children.map(print).join("")}</${tag}>` : ` />`}`
    case "function":
      return print(tag({ props, children }))
    case "object":
      if (tag == null) {
        return print(children)
      }
    // default: console.log({ tag, props, children })
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
