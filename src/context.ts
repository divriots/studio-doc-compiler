import type { SourceTree } from "@divriots/studio-compiler-support";
import type { Page, Context, GraphNode } from "./types";
import { join } from "path";

const contextPages = (
  items: any[] = [],
  pages: Page[],
  parent = ""
): {
  pages: Page[];
  pagesGraph: GraphNode[];
} => {
  const graph = [] as GraphNode[];
  const result = [];
  for (const item of items) {
    if (typeof item === "string") {
      const pageFilter = new RegExp(`\/${item}\/(?:doc\/)?index\..*$`, "i");
      const page = pages.find((p) => pageFilter.test(join("/", p.input)));
      if (page) {
        page.nav = { key: item };
        if (parent) page.nav.parent = parent;
        result.push(page);
        graph.push({ key: item, page });
      }
    } else {
      const [group, groupItems] = item;
      const subResults = contextPages(groupItems, pages, group);
      graph.push({ key: group, children: subResults.pagesGraph });
      for (const page of subResults.pages) result.push(page);
    }
  }
  return { pages: result, pagesGraph: graph };
};

export const buildContext = (
  pages: Page[],
  tree: SourceTree,
  base: string,
  mapPageUrlToRenderModuleUrl: (string) => string | undefined
): Context => {
  let { packages = {} } =
    "studio.config.json" in tree ? JSON.parse(tree["studio.config.json"]) : {};
  return {
    base,
    mapPageUrlToRenderModuleUrl,
    ...contextPages(packages.menu, pages),
  };
};
