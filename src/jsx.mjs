export { printHTML } from "./jsx-print.mjs"
export { mountHTML } from "./jsx-dom.mjs"

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
