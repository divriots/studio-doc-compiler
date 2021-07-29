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
  registry: BuildStepArgs["registry"]
): Promise<void> => {
  for (const { input, url } of pages.filter((p) => /\.mdx?$/.test(p.input))) {
    // Inject context for mdx , TODO for mdjs
    if (/\.mdx$/.test(input))
      output[url] += `\n\nexport const __context = ${JSON.stringify(
        __context
      )};`;
    const compiler = await registry[path.extname(input).slice(1)]();
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
