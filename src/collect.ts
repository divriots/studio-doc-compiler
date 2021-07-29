import type { SourceTree } from "@divriots/studio-compiler-support";
import type { Page } from "./types";
import { matterHTML, matterMD } from "@divriots/studio-matter-helper";

export const collectPages = (
  input: SourceTree
): { output: SourceTree; pages: Page[] } => {
  const output: SourceTree = {};
  const pages: Page[] = [];
  for (const file in input) {
    const raw = input[file];
    const url = file.replace(/\.mdx?$/, ".html");
    let { data = {}, content = raw } = /\.html$/.test(file)
      ? matterHTML(raw)
      : matterMD(raw);
    if (/\.mdx$/.test(file))
      for (const [k, v] of Object.entries(data))
        content += `\n\nexport const ${k} = ${JSON.stringify(v)}`;
    pages.push({ url, input: file, data });
    output[url] = content;
  }
  return { output, pages };
};
