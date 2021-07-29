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
  Navigation properties to help reconstruct navigation tree
   */
  nav?: { key: string; parent?: string };
  /**
  Front Matter Data
   */
  data: Record<string, any>;
}

export interface Context {
  pages: Page[];
}

export type Layout = {
  data: any;
  render: ({ page: Page, content: string, __context: Context }) => string;
};
