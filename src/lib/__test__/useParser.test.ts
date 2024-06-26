import { expect, test } from "bun:test";
import { useParser } from "../useParser";

const Body = `
<div>
  <article class='Box-row'><h2>\n    \n      \n    \n\n\n      \n        testUser /\n\n      test-repo\n  </h2></article>
  <article class='Box-row'><h2>test2</h2></article>
  <article class='Box-row'><h2>test3</h2></article>
</div>
`;

test("parse", async () => {
  const result = await useParser(Body);

  expect(result.length).toBe(3);
});
