/* eslint-disable @typescript-eslint/no-unused-vars */
export async function queryAsync(selector: string): Promise<Element | null> {
  return new Promise((resolve) => {
    const element = document.querySelector(selector);
    resolve(element);
  });
}