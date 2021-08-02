import { isMdjsContent } from "./utils";
import type { Page, Context } from "./types";
import type {
  SourceTree,
  BuildStepArgs,
} from "@divriots/studio-compiler-support";
import * as path from "path";

export const compilePages = async (
  pages: Page[],
  output: SourceTree,
  __context: Context,
  registry: BuildStepArgs["registry"],
  hasDefaultMdjsLayout: boolean
): Promise<void> => {
  for (const page of pages.filter((p) => /\.mdx?$/.test(p.input))) {
    const { input, url, data } = page;
    const ext = path.extname(input).slice(1);
    if (ext === "mdx") {
      for (const [k, v] of Object.entries(data)) {
        output[url] += `\n\nexport const ${k} = ${JSON.stringify(v)}`;
      }
      output[url] += `\n\nexport const __context = ${JSON.stringify(
        __context
      )};`;
    } else if (
      ext === "md" &&
      (hasDefaultMdjsLayout || isMdjsContent(output[url]))
    ) {
      output[url] = `\`\`\`js script
export const __context = ${JSON.stringify({
        ...__context,
        currentPage: page,
      })};
export const __internals = {};
\`\`\`

${output[url]}`;
    }
    const compiler = await registry[ext]();
    let { code, html, runtimeCode } = await compiler.compile(
      output[url],
      input
    );
    if (code) {
      output[input + ".js"] = code;
      if (runtimeCode) html += `<script type="module">${runtimeCode}</script>`;
    }
    output[url] = html;
  }
};
