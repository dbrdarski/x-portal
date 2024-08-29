import Gun from "gun"
import * as Crypto from "./crypto.mjs"

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
