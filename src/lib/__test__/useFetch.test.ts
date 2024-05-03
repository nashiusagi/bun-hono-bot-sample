import { expect, test } from "bun:test"
import { useFetch } from "../useFetch"

test("fetch", async ()=>{
  const result = await useFetch({
    url: "http://api.randomuser.me/",
    options: {}
  })

  console.log(`${result.results[0].name.last} ${result.results[0].name.first}`)

  expect(result).toBeTruthy(true)
})
