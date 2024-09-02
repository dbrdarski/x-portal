import Router from "url-router"

const renderPage = (HtmlPageTemplate, handler) => ([key, Page]) => [key, handler.bind(null, Page(HtmlPageTemplate))]

export const createRouter = (HtmlPageTemplate, handler, routes) => {
  const router = new Router(
    Object.fromEntries(
      Object.entries(routes).map(
        renderPage(HtmlPageTemplate, handler)
      )
    )
  )

  return url => {
    const match = router.find(url)
    console.log({ match })
    return match.handler(match.params)
  }
}
