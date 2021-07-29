import type { Page, Layout, Context } from "./types";
import type {
  SourceTree,
  BuildStepArgs,
} from "@divriots/studio-compiler-support";
const globalLayoutCache = new Map<string, Layout>();

export const renderPages = async (
  pages: Page[],
  output: SourceTree,
  __context: Context,
  registry: BuildStepArgs["registry"],
  tree: BuildStepArgs["tree"]
) => {
  const localLayoutCache = new Map<string, Layout>();
  for (const page of pages.filter((p) => p.url)) {
    const layout = page.data.layout as string;
    if (!layout) continue;
    let layoutFn =
      localLayoutCache.get(layout) || globalLayoutCache.get(layout);
    if (!layoutFn) {
      if (layout in tree) {
        layoutFn = await registry.loadFile(layout, tree);
        localLayoutCache.set(layout, layoutFn);
      } else if (/^https?:\/\//.test(layout)) {
        layoutFn = await import(layout);
        globalLayoutCache.set(layout, layoutFn);
      } else {
        console.warn("Only https and local layout are supported");
        layoutFn = { data: {}, render: (p) => p.content };
      }
    }
    const { render, data } = layoutFn;
    page.data = { ...data, ...page.data };
    output[page.url] = render({ page, __context, content: output[page.url] });
  }
};
