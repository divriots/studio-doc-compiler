import type {
  BuildStepArgs,
  SourceTree,
} from "@divriots/studio-compiler-support";
import { collectPages } from "./collect";
import { buildContext } from "./context";
import { compilePages } from "./compile";
import { renderPages } from "./render";
import { isMdjsContent } from "./utils";
import { Page } from "./types";

export * from "./types";

function defaultMdjsConf(
  hasDefaultMdjsLayout: boolean,
  pages: Page[],
  input: SourceTree,
  tree: SourceTree,
  output: SourceTree
) {
  if (
    !hasDefaultMdjsLayout &&
    pages.find((p) => isMdjsContent(input[p.input])) &&
    !tree["mdjs.config.js"]
  ) {
    output["mdjs.config.js"] = `export default {}`;
  }
}

async function compile({
  input,
  registry,
  tree,
  context,
}: BuildStepArgs): Promise<SourceTree> {
  if (context === "npm_publish") return {};
  const { pages, output } = collectPages(input);
  const hasDefaultMdjsLayout = "mdjs.config.js" in tree;
  defaultMdjsConf(hasDefaultMdjsLayout, pages, input, tree, output);
  const __context = buildContext(pages, tree);
  await compilePages(pages, output, __context, registry, hasDefaultMdjsLayout);
  await renderPages(pages, output, __context, registry, tree);
  return output;
}

export {
  compile,
  collectPages,
  buildContext,
  renderPages,
  isMdjsContent,
  Page,
  defaultMdjsConf,
};
