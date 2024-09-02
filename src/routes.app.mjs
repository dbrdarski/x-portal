import HomePage from "./pages/HomePage.mjs"

const simplePage = content => () => Html => <Html>{content}</Html>

export default {
  "/": HomePage,
  "(.*)": simplePage("404 - Not found"),
}
