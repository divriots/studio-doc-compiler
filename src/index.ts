import type {
  BuildStepArgs,
  SourceTree,
} from "@divriots/studio-compiler-support";
import { collectPages } from "./collect";
import { buildContext } from "./context";
import { compilePages } from "./compile";
import { renderPages } from "./render";

export * from "./types";

export async function compile({
  input,
  registry,
  tree,
  context,
}: BuildStepArgs): Promise<SourceTree> {
  if (context === "npm_publish") return {};
  const { pages, output } = collectPages(input);
  const __context = buildContext(pages, tree);
  await compilePages(pages, output, __context, registry);
  await renderPages(pages, output, __context, registry, tree);
  return output;
}
