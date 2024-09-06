import Gun from "gun"
import * as Crypto from "./crypto.mjs"
import routes from "./routes.app.mjs"
import { createRouter } from "./router.mjs"
import { h, frag, mountHTML } from "./jsx.mjs"
import HtmlPage from "./components/HtmlPage.mjs"

globalThis.h = h
globalThis.frag = frag

window.addEventListener("load", () => {
  const match = createRouter(HtmlPage, mountHTML(document), routes)
  const { pathname } = window.location
  m = match(pathname)

  console.log({ m, pathname })
})

const $ = (...selectors) => handler => {
  window.addEventListener("load", () => {
    const matches = selectors.map(selector => document.querySelector(selector))
    matches.every(x => x) && handler(...matches)
  })
}

const preventDefault = e => (e.preventDefault(), false)

let passkey = []
$(".passkey-input", ".passkey-preview")((input, preview) => {
  input.oncut = preventDefault
  input.oncopy = preventDefault
  input.onpaste = preventDefault

  input.addEventListener("onkeypress", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
      e.preventDefault()
      return false
    }
  })

  input.addEventListener("input", (event) => {
    const { target: { value, selectionStart }, data } = event
    // console.log(data, value, selectionStart, event)
    data
      ? passkey.splice(selectionStart - 1, value.length > passkey.length ? 0 : passkey.length - value.length + 1, data)
      : passkey.splice(selectionStart, passkey.length - value.length)
    event.target.value = value.replaceAll(/.{1}/gi, "•")
    event.target.setSelectionRange(selectionStart, selectionStart)
    preview.setAttribute("style", `--content: "${passkey.join("")}"`)
  })
})
