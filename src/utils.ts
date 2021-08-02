export function isMdjsContent(content: string): boolean {
  return /```js.* script/.test(content);
}
