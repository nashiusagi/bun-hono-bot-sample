import { parse } from "node-html-parser"

export const useParser = async (body: string) => {
  const root = await parse(body)
  const articles = root?.querySelectorAll(".Box-row")

  const trends = articles.map((element, idx) => {
    const textDirty = String(element.querySelector("h2")?.innerText)
    const repoName = textDirty ? cleanInnerText(textDirty) : ""

    return {
      rank: idx,
      title: repoName,
      link: `https://github.com/${repoName}`
    }
  })

  return trends
}

/**
 * innerTextにはspanタグなど由来の\nや\sが紛れ込むので取っ払う
 */
const cleanInnerText = (innerText: string): string => {
  return innerText.replace(/\n/g, '').replace(/\s/g, '')
}
