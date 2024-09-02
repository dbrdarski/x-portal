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

const $ = (selector, handler) => {
  window.addEventListener("load", () => {
    const match = document.querySelector(selector)
    match && handler(match)
  })
}

let passkey = []
$(".passkey-input", (input) => {
  input.addEventListener("input", (event) => {
    const { target: { value, selectionStart }, data } = event
    // console.log(data, value, selectionStart, event)
    data
      ? passkey.splice(selectionStart - 1, value.length > passkey.length ? 0 : passkey.length - value.length + 1, data)
      : passkey.splice(selectionStart, passkey.length - value.length)
    event.target.value = value.replaceAll(/.{1}/gi, "•")
    event.target.setSelectionRange(selectionStart, selectionStart)
  })
})
