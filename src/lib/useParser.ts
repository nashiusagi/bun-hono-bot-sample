import { parse } from "node-html-parser"

export const useParser = async (body: string) => {
  const root = await parse(body)
  const articles = root?.querySelectorAll(".Box-row")

  const trends = articles.map((element) => {
    const textDirty = String(element.querySelector("h2")?.innerText)
    const text = textDirty?.replace(/\n/g, '').replace(/\s/g, '')
    return {
      title: text,
      link: `https://github.com/${text}`
    }
  })

  return trends
}
