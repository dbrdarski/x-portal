import { h, frag, printHTML } from "./jsx.mjs"
import connect from "connect"
import serveStatic from "serve-static"
import Router from "url-router"
import HtmlPage from "./components/HtmlPage.mjs"
import HomePage from "./pages/HomePage.mjs"
import fs from "fs"

globalThis.h = h
globalThis.frag = frag

const renderPage = (Page) => {
  const output = printHTML(Page(HtmlPage))
  return () => output
}

export default async () => {
  const app = connect()
  const simplePage = content => renderPage(Html => <Html>{content}</Html>)
  const router = new Router({
    "/": renderPage(HomePage),
    "(.*)": simplePage("404 - Not found"),
  })

  app.use(serveStatic("public"))
  app.use("/favicon", (req, res, next) => {
    res.end("ok")
  })

  app.use("/", (req, res, next) => {
    const r = router.find(req.originalUrl)
    res.end(r.handler(r.params))
  })

  return app
}
