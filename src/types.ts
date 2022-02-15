export interface Page {
  /**
  HTML url relative to the base root of the project, to be used in href (i.e. packages/foo/doc/index.html)
   */
  url: string;
  /** 
  Input file path relative the the root of the project (i.e. packages/foo/doc/index.md)
  */
  input: string;
  /** 
  URL of the JS module with a function to render the DOC dynamically for use in the frontend router.
  URL is relative to the root of the project (i.e. packages/foo/doc/index.render-doc.js)
  */
  renderDocUrl: string;
  /**
  Navigation properties to help reconstruct navigation tree
   */
  nav?: { key: string; parent?: string };
  /**
  Front Matter Data
   */
  data: Record<string, any>;
}

export interface GraphNode {
  key: string;
  page?: Page;
  children?: GraphNode[];
}

export interface Context {
  pages: Page[];
  pagesGraph: GraphNode[];
}

export type Layout = {
  data: any;
  render: ({ page: Page, content: string, __context: Context }) => string;
};
