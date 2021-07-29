import type { SourceTree } from "@divriots/studio-compiler-support";
import type { Page, Context } from "./types";
import * as path from "path";

const contextPages = (
  items: any[] = [],
  dir: string,
  pages: Page[],
  parent = ""
): Page[] => {
  const result = [];
  for (const item of items) {
    if (typeof item === "string") {
      const page = pages.find((p) => p.input.startsWith(path.join(dir, item)));
      if (page) {
        page.nav = { key: item };
        if (parent) page.nav.parent = parent;
        result.push(page);
      }
    } else {
      const [group, groupItems] = item;
      for (const page of contextPages(groupItems, dir, pages, group))
        result.push(page);
    }
  }
  return result;
};

export const buildContext = (pages: Page[], tree: SourceTree): Context => {
  let { packages = {} } =
    "studio.config.json" in tree ? JSON.parse(tree["studio.config.json"]) : {};
  return {
    pages: contextPages(packages.menu, packages.dir || "", pages),
  };
};
