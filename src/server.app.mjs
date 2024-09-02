import { h, frag, printHTML } from "./jsx.mjs"
import connect from "connect"
import serveStatic from "serve-static"
import HtmlPage from "./components/HtmlPage.mjs"
import { createRouter } from "./router.mjs"
import { once } from "./utils.mjs"
import routes from "./routes.app.mjs"

globalThis.h = h
globalThis.frag = frag

export default async () => {
  const app = connect()
  const match = createRouter(HtmlPage, once(printHTML), routes)

  app.use(serveStatic("public"))
  app.use("/favicon", (req, res, next) => {
    res.end("ok")
  })

  app.use("/", (req, res, next) => {
    // const r = router.find(req.originalUrl)
    res.end(match(req.originalUrl))
  })

  return app
}
